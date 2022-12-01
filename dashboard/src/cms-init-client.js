import TerminusClient ,{UTILS} from '@terminusdb/terminusdb-client'
import React , {useState,useEffect,useContext} from 'react'
import {formatErrorMessage} from "./utils/appUtils"
import { classDocuments } from './utils/ClassDocuments'
import { schemaFrame } from './utils/SchemaFrame'
export const ClientContext = React.createContext()
export const ClientObj = () => useContext(ClientContext)

const opts = {
    server : "http://127.0.0.1:6363"

}

export const ClientProvider = ({children}) => {
    const [client, setClient] = useState(null)
    const [clientMain, setClientMain] = useState(null)
    const classes = classDocuments
    const frames = schemaFrame
  
    //  const [accessControlDashboard, setAccessControl] = useState(null)
   //const [classes,setClasses] = useState([])
    //const [frames,setFrames] = useState([])

    const [loadingServer, setLoadingServer] = useState(false)
    const [error,setError] = useState(false)
    const [currentBranch,setCurrentBranch] = useState('main')
    const [currentChangeRequest,setCurrentChangeRequest] = useState(null)
    const [userHasMergeRole,setTeamUserRoleMerge] = useState(false)
    const [currentCRObject, setCurrentCRObject]=useState(false)

    const hasRebaseRole=(teamUserRoles)=>{
        try{
            const actions = teamUserRoles.capability[0].role[0].action
            if(actions.find(element=>element==="rebase")){
                setTeamUserRoleMerge(true)
            }
        }catch(err){
            console.log(err)
        }

    }

    useEffect(() => {
        const initClient = async(credentials)=>{
            try{
                
                 //the last organization viewed organization
                 //this is for woql client 
                const dbClient = new TerminusClient.WOQLClient(opts.server,credentials)
                const accessControl = new TerminusClient.AccessControl(opts.server,credentials)

               //const result = await dbClient.getClasses();

               //console.log(JSON.stringify(result,null,4))
               // const frameResult = await dbClient.getSchemaFrame(null, dbClient.db())

              //  console.log(JSON.stringify(frameResult,null,4))
                const teamUserRoles = await accessControl.getTeamUserRoles(credentials.user,credentials.organization)
                hasRebaseRole(teamUserRoles)

                const lastBranch = localStorage.getItem("TERMINUSCMS_BRANCH")            
                if(lastBranch){
                    dbClient.checkout(lastBranch)
                    const lastChangeRequest = localStorage.getItem("TERMINUSCMS_CHANGE_REQUEST_ID")
                    setCurrentBranch(lastBranch)
                    setCurrentChangeRequest(lastChangeRequest)
                }
                //manageClasses(result)
            
                //setClasses(result)
                //setFrames(frameResult)
               // const access =  new TerminusClient.AccessControl(opts.server,accessCredential)
               // const clientAccessControl = new AccessControlDashboard(access)

               //  }
                
               //  setAccessControl(clientAccessControl)
               //  setClientMain(dbClientMain)
                 setClient(dbClient)
            } catch (err) {
                const message = formatErrorMessage(err)
                setError(message)
            }finally {
                setLoadingServer(false)
            }
        }
        if(opts && opts.server){           
            //to be review the local connection maybe don't need a user in the cloud
            //and don't need auth0 too
            setLoadingServer(true)
            const user = localStorage.getItem("TerminusCMS-USER") 
            const key = localStorage.getItem("TerminusCMS-KEY")
            const credentials  = {user ,key, organization:"terminuscms", db:"lego" }                        
            initClient(credentials)

        }
    }, [opts])

    const updateBranch = (branchName,changeRequestId)=>{
        client.checkout(branchName)
        localStorage.setItem("TERMINUSCMS_BRANCH",branchName)
        localStorage.setItem("TERMINUSCMS_CHANGE_REQUEST_ID",changeRequestId)
        setCurrentBranch(branchName)
        setCurrentChangeRequest(changeRequestId)
    } 

    return (
        <ClientContext.Provider
            value={{
                client,
                classes,
             //   clientMain,
                
               // nodeClasses,
               // linkEdges,
                loadingServer,
                error,
                frames,
                currentBranch,
                updateBranch,
                currentChangeRequest,
                userHasMergeRole,
                currentCRObject, 
                setCurrentCRObject,
                setCurrentChangeRequest
            }}
        >
            {children}
        </ClientContext.Provider>
    )
}

