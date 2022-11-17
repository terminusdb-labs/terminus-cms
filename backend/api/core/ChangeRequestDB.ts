import TerminusClient , {WOQLClient,WOQL} from "@terminusdb/terminusdb-client"
import { DocParamsGet } from "@terminusdb/terminusdb-client/dist/typescript/lib/typedef"
import { Request } from "express"
import * as typeDef from "./typeDef"
import {ApiError} from "./ApiError"
const server : string = process.env.SERVER_ENDPOINT || "http://127.0.0.1:6363"
//maybe we can create a team
//const user = process.env.USER_NAME
//const key = process.env.USER_KEY
const team = "terminuscms"//process.env.TEAM_NAME

class ChangeRequestDB {
    //to be review
    client: WOQLClient;
    request : Request
    authPass : string | undefined
    authUser : string | undefined
    //client : typeof TerminusClient.WOQLClient
    constructor(req : Request) {
        this.request = req
        this.authPass = req.context.authPass
        this.authUser = req.context.authUser
        this.client = this.connectWithCurrentUser("change_requests")  
    }

    async createChangeRequest(payload:typeDef.ChangeReqDoc, message:string){
        let docResult : any[] | string = ''
        try{          
            //return an array with the document id
            docResult = await this.client.addDocument(payload,undefined,undefined,message)
            const tmpClient : WOQLClient = this.connectWithCurrentUser()
            //create a new branch
            await tmpClient.branch(payload.tracking_branch)
            const docId: string= docResult[0]
            const docIdHash:string=  docId.substring(docId.lastIndexOf("/")+1)
            return {change_request_id:docIdHash}
        // to be review
        }catch(err: any){
            const errData = err.data || {}

            //if the branch exists I have to remove the change request document
            if(errData["api:error"] && errData["api:error"]["@type"] === "api:BranchExistsError"){
                await this.client.deleteDocument({id:docResult})
                //override the change branch message with a change request message
                errData["api:message"] = `The Change Request ${payload.tracking_branch} already exists`
            }
            throw err
        }
    }

    /*
      const query = {
    type: 'keys_api',
    query: { user: userId, organization: orgId }
  }
  return this.client.getDocument({ as_list: true }, null, null, '', false, (query))
  */
    async getChangeRequestByName(trackingBranch:string){
        const queryObj : typeDef.GetRequestQuery= {
            type: 'ChangeRequest',
            query: { tracking_branch:trackingBranch}
          }

          const requestDoc = await this.client.getDocument(undefined, undefined, undefined, undefined, undefined , queryObj)
          if(!requestDoc)
          {
            throw new Error ("change request not found")
          }
        
    }

    /*
     {
         "Active Commit ID":"terminusdb://ref/data/ValidCommit/uuyiezbpfpqpe52qw91c9yymr0qbegu",
         "Branch":"terminusdb://ref/data/Branch/main",
         "Identifier":{
            "@type":"xsd:string",
            "@value":"uuyiezbpfpqpe52qw91c9yymr0qbegu"
       */

    async getLastMainCommitId(client:WOQLClient){       
        const query =  WOQL.using("_commits").triple('v:Branch', 'name', WOQL.string('main'))
                        .triple('v:Branch', 'head', 'v:Active Commit ID')
		                .triple('v:Active Commit ID',"identifier","v:Identifier")  
                        
    const V = WOQL.Vars('ancestor')
        
    const query01 = WOQL.distinct(V.ancestor).path(
                            'Symptom/d4f13e6d297cc085aac6c2e509542f7a7807c17bae75daaef513ba90fbb7ce1a',
                            '(<effect,cause)+',
                            V.ancestor
                          )
        
                       

                       
           
    const v = WOQL.Vars('term','document_id','term_count',
                       'results',
                       'term_id','term_count_id')

              const count_query = WOQL.group_by(
                  [v.term],
                  [v.document_id,v.term_count],
                  v.results, WOQL.and(WOQL.triple(v.term_id,'term',v.term),
                  WOQL.triple(v.term_count_id,'term',v.term_id),
                  WOQL.triple(v.term_count_id,'count',v.term_count) 
                 .triple(v.document_id,'terms',v.term_count_id)));
                 
         

        const result = await client.query(query)
        if(Array.isArray(result.bindings)){
            return result.bindings[0]['Identifier']['@value']
        }
    }

    async changeRequestStatus(changeIdHash:string,status:string,message:string){
        const changeId = `ChangeRequest/${changeIdHash}`
        const requestDoc = await this.client.getDocument({id:changeId})
        if(status === "Merged" ){
            if(requestDoc.status==="Submitted"){
                let trackingBranch : string = requestDoc.tracking_branch
                try{
                    const legoClient = this.connectWithCurrentUser()

                    const lastCommitId = await this.getLastMainCommitId(legoClient)
                    
                    await legoClient.apply("main", trackingBranch, message, true)

                    requestDoc.merge_commit_id = lastCommitId 
               // await legoClient.deleteBranch(trackingBranch)
                }catch(err){
                    throw new Error (`I can not merge the change request ${trackingBranch}`) 
                }
            }else{
                throw new Error (`I can not merge a change request with ${requestDoc.status} status` ) 
            }
        }
        requestDoc.status = status
        const messageObj : typeDef.MessageObj = {"author":this.authUser || "", "@type" : "Message",  "text":message, "timestamp":Date.now()}
        requestDoc.messages.push(messageObj)
        return this.client.updateDocument(requestDoc)
    }

    async getChangeRequestDiff(changeId?: string){
        const changeRequest = await this.getChangeRequests(changeId,false)
        let trackingBranch : string = changeRequest.tracking_branch;
        if(changeRequest.status === "Merged" && changeRequest.merge_commit_id){
            trackingBranch = changeRequest.merge_commit_id
        }
        let options={ 
            "keep": { 
                "@id" : true, 
                "@type": true
            }
        }
        const legoClient = this.connectWithCurrentUser()
        return legoClient.getVersionDiff("main", trackingBranch, undefined, options)
    }


    //get if the changeRequest

    async getChangeRequests(changeId?: string, as_list:boolean = true){
        let params : DocParamsGet= {type:"ChangeRequest",as_list:as_list}
        if(changeId){
            params['id'] = `ChangeRequest/${changeId}`
        }
        return this.client.getDocument(params)   
    }

    connectWithCurrentUser(db_name:string = "lego") : WOQLClient {
        const tmpClient = new TerminusClient.WOQLClient(server, { key: this.authPass, user:  this.authUser, organization:team })
        tmpClient.db(db_name)
        return tmpClient
    }

}

export default ChangeRequestDB
