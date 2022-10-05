import TerminusClient , {WOQLClient} from "@terminusdb/terminusdb-client"
import { Request } from "express"
import * as typeDef from "./typeDef"
const server : string = process.env.SERVER_ENDPOINT || "http://127.0.0.1:6363"
//maybe we can create a team
const user = process.env.USER_NAME
const key = process.env.USER_KEY
const team = process.env.TEAM_NAME

class ChangeRequestDB {
    //to be review
    client: WOQLClient;
    request : Request
    authPass : string | undefined
    authUser : string | undefined
    //client : typeof TerminusClient.WOQLClient
    constructor(req : Request) {
        this.client = new TerminusClient.WOQLClient(server, { key: key, user: user,organization:team })
        this.client.db('change_requests')
        this.request = req
        this.authUserFromHeader ()
    }

    async createChangeRequest(payload:typeDef.ChangeReqDoc, message:string){
        let docResult : any[] | string = ''
        try{          
            //return an array with the document id
            docResult = await this.client.addDocument(payload,undefined,undefined,message)
            const tmpClient : WOQLClient = this.connectWithCurrentUser()
            //create a new branch
            return await tmpClient.branch(payload.tracking_branch)
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


    async getChangeRequestById(changeId:string){
          const requestDoc = await this.client.getDocument({id:changeId})
          const trackingBranch: string = await requestDoc.tracking_branch
          const tmpClient:WOQLClient = this.connectWithCurrentUser()
          const diffResult:object = await tmpClient.getVersionDiff("main",trackingBranch)
          const diffObj : object ={}
          if(Array.isArray(diffResult)){
            diffResult.forEach(item=>{

            })
          }

          if(!requestDoc)
          {
            throw new Error ("change request not found")
          }
        
    }

    getChangeRequests(){
        return this.client.getDocument({type:"ChangeRequest",as_list:true})
    }

    connectWithCurrentUser() : WOQLClient {
        const tmpClient = new TerminusClient.WOQLClient(server, { key: this.authPass, user:  this.authUser, organization:team })
        tmpClient.db('lego')
        return tmpClient
    }

    authUserFromHeader () {
        const auth : string = this.request.headers.authorization || ""
        const base64Url = auth.split('Basic')[1]
        const basicDecode = atob(base64Url)
        const basicArr = basicDecode.split(':')
        this.authUser = basicArr[0]
        this.authPass = basicArr[1]
    }
}

export default ChangeRequestDB