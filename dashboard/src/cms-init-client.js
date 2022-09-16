import TerminusClient ,{UTILS} from '@terminusdb/terminusdb-client'
import React , {useState,useEffect,useContext} from 'react'
export const ClientContext = React.createContext()
export const ClientObj = () => useContext(ClientContext)

const opts = {
    server : "http://127.0.0.1:6363"

}
export const ClientProvider = ({children}) => {
    const [client, setClient] = useState(null)
    const [accessControlDashboard, setAccessControl] = useState(null)
    const [loadingServer, setLoadingServer] = useState(false)
    const [classes,setClasses] = useState([])

    useEffect(() => {
        const initClient = async(credentials)=>{
            try{
                 //the last organization viewed organization
                 //this is for woql client 
                const dbClient = new TerminusClient.WOQLClient(opts.server,credentials)
       
                const result = await dbClient.getClasses();
                setClasses(result)
               // const access =  new TerminusClient.AccessControl(opts.server,accessCredential)
               // const clientAccessControl = new AccessControlDashboard(access)

               //  }
                
               //  setAccessControl(clientAccessControl)
                 setClient(dbClient)
            } catch (err) {
              //  const message = formatErrorMessage(err)
                setError(err.message)
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
            const credentials  = {user ,key, organization:"admin", db:"lego_set" }                        
            initClient(credentials)

        }
    }, [opts])


    return (
        <ClientContext.Provider
            value={{
                client,
                classes
            }}
        >
            {children}
        </ClientContext.Provider>
    )
}

