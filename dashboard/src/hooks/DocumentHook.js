import React, {useState,useEffect} from "react";

export function GetDiffList(client, trackingBranch){
    const [result, setResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    async function getDiffList() {
        try{
            //setLoading(true)
            const diffResults = await client.getVersionDiff("main", trackingBranch, null,  {"keep":{"@id":true, "@type": true}} )
            
            setResult(diffResults)
            //setLoading(false)
           // return res
        }
        catch(err){
            //setLoading(false)
           setErrorMsg(err.message)
       }
    }

    useEffect(() => {
        if (trackingBranch) getDiffList()
    }, [trackingBranch])

    return {result}
}

export function GetDocumentByBranches(client, trackingBranch,documentId){
    const [result, setResult] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)

    async function getDiffList() {
        try{
            //setLoading(true)
            //this is important!!!
            const clientCopy = client.copy()
            clientCopy.checkout(trackingBranch)

            const values = await Promise.all([client.getDocument({id:documentId}), clientCopy.getDocument({id:documentId})])

            setResult(values)
            //setLoading(false)
           // return res
        }
        catch(err){
            //setLoading(false)
           setErrorMsg(err.message)
       }
    }

    useEffect(() => {
        if (trackingBranch) getDiffList()
    }, [trackingBranch])

    return {result}
}

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
    
