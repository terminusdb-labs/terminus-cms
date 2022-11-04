import TerminusClient ,{UTILS} from '@terminusdb/terminusdb-client'
import React , {useState,useEffect,useContext} from 'react'
export const ClientContext = React.createContext()
export const ClientObj = () => useContext(ClientContext)

const opts = {
    server : "http://127.0.0.1:6363"

}

const classObj = {}
const linkPropertyFromTo = {}
const linkPropertyToFrom = {}
const noProperty = {"@id":true,"@key":true,"@subdocument":true,"@type":true}
const nodeClasses = []
const linkEdges = []


const manageClasses =(classes) =>{
    if(!Array.isArray(classes)) return 
    classes.forEach((item)=>{
        classObj[item['@id']] = item
        nodeClasses.push( {
            "type": "node",
            "id": item['@id'],
            "nodetype": item['@id'],
            "color": [
                255,
                0,
                255
            ],
            "text": item['@id'],
            "radius": 30
        })
    })

    classes.forEach((item)=>{
        const classId= item["@id"]
        Object.keys(item).forEach(key=>{
            if(!noProperty[key]){
                let propValue =  typeof item[key] === "object" ? item[key]["@class"] : item[key] 
                if(classObj[propValue]){
                    if(typeof linkPropertyFromTo[classId] !== "object"){
                        linkPropertyFromTo[classId] = {}
                    } 
                    //maybe is better an array ??
                    linkPropertyFromTo[classId][key] = propValue
                    linkEdges.push ({
                        "type": "link",
                        "target": propValue,
                        "source": classId,
                        "text": key
                    })
                    if(typeof linkPropertyToFrom[propValue] !== "object"){
                        linkPropertyToFrom[propValue] = {}
                    }
                    //propValue is the class name 
                    //no complete secure of this
                    linkPropertyToFrom[propValue][key] = classId
                }
            }
        })
    })

    console.log(classObj)
    console.log(linkPropertyFromTo)
    console.log(linkPropertyToFrom)

}

const createQuery =()=>{

}

const linkPropertyWithClass = () =>{
    
}


 
export const ClientProvider = ({children}) => {
    const [client, setClient] = useState(null)
  //  const [accessControlDashboard, setAccessControl] = useState(null)
    const [loadingServer, setLoadingServer] = useState(false)
    const [classes,setClasses] = useState([])
    const [frames,setFrames] = useState([])
    const [error,setError] = useState([])
    const [currentBranch,setCurrentBranch] = useState('main')
    const [currentChangeRequest,setCurrentChangeRequest] = useState(null)
    const [teamUserRoleMerge,setTeamUserRoleMerge] = useState(false)
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

                const result = await dbClient.getClasses();
                const frameResult = await dbClient.getSchemaFrame(null, dbClient.db())
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
            
                setClasses(result)
                setFrames(frameResult)
               // const access =  new TerminusClient.AccessControl(opts.server,accessCredential)
               // const clientAccessControl = new AccessControlDashboard(access)

               //  }
                
               //  setAccessControl(clientAccessControl)
                 setClient(dbClient)
            } catch (err) {
              //  const message = formatErrorMessage(err)
                setError(err.message)
                console.log(err)
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
                nodeClasses,
                linkEdges,
                frames,
                currentBranch,
                updateBranch,
                currentChangeRequest,
                teamUserRoleMerge,
                currentCRObject, 
                setCurrentCRObject,
                setCurrentChangeRequest
            }}
        >
            {children}
        </ClientContext.Provider>
    )
}

