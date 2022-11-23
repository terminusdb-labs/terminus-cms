import TerminusClient ,{UTILS} from '@terminusdb/terminusdb-client'
import React , {useState,useEffect,useContext} from 'react'
import {formatErrorMessage} from "./utils/appUtils"
export const ClientContext = React.createContext()
export const ClientObjWeb = () => useContext(ClientContext)


const opts = {
    server : "http://127.0.0.1:6363"

}
 
export const ClientProviderWeb = ({children}) => {
    const [clientMain, setClientMain] = useState(null)
    const [loadingServer, setLoadingServer] = useState(false)
    const [error,setError] = useState(false)

    useEffect(() => {
        const initClient = async(credentials)=>{
            try{   
                const dbClientMain =new TerminusClient.WOQLClient(opts.server,credentials)
                setClientMain(dbClientMain)
               
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
            const credentials  = {user:"anyUser" ,key:"demo_password", organization:"terminuscms", db:"lego" }                        
            initClient(credentials)

        }
    }, [opts])

    return (
        <ClientContext.Provider
            value={{
                clientMain,
                loadingServer,
                error,
            }}
        >
            {children}
        </ClientContext.Provider>
    )
}

