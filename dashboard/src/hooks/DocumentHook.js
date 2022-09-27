import React, {useState,useEffect} from "react";

export function GetDocumentHook(client, documentId){// setLoading, setSuccessMsg, setErrorMsg) {
        const [result, setResult] = useState(false)
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState(false)
    
        async function getDocument() {
            try{
                let params={}
                params['id']=documentId
                //setLoading(true)
                const res = await client.getDocument(params, client.db())
                
                setResult(res)
                //setLoading(false)
               // return res
            }
            catch(err){
                //setLoading(false)
               //setErrorMsg(err.message)
           }
        }
    
        useEffect(() => {
            if (documentId) getDocument()
        }, [documentId])
    
        return {result}
    }
    
