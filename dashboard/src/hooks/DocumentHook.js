import React, {useState,useEffect} from "react";

export function GetDocumentByBranches_OLD(client, trackingBranch,documentId){
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

// edit documents
export function EditDocumentHook(client, extractedUpdate, setLoading) {
    const [result, setResult] = useState(false)

    async function updateDocument() {
        try{

            let params={}
            let update = extractedUpdate
            let documentId = extractedUpdate["@id"]
            let commitMsg=`Updating document ${documentId}`
            setLoading(true)
            const res = await client.updateDocument(update, params, client.db(), commitMsg)
            console.log("updated res", res)
            setLoading(false)
        }
        catch(err){
           //setErrorMsg(err.message)
           //setLoading(false)
           console.log("err.message", err.message)
       }
    }

    useEffect(() => {
        if (extractedUpdate) updateDocument()
    }, [extractedUpdate])

    return result
}

/**
 * 
 * @param {*} client TerminusDB Client
 * @param {*} trackingBranch Tracking branch ID
 * @param {*} setError Constant to catch error 
 * @returns diff list from branches
 */
export function GetDiffList(client, trackingBranch, setError){
    const [result, setResult] = useState(false)

    async function getDiffList() {
        try{
            let options={ 
                "keep": { 
                    "@id" : true, 
                    "@type": true
                }
            }
            const diffResults = await client.getVersionDiff("main", trackingBranch, null, options)
            setResult(diffResults)
        }
        catch(err){
            setError(err.message)
       }
    }

    useEffect(() => {
        if (trackingBranch) getDiffList()
    }, [trackingBranch])

    return result
}

/**
 * 
 * @param {*} client TerminusDB Client
 * @param {*} branch branch to get document from
 * @param {*} documentID documentID clicked from diff accordians
 * @param {*} setValue Constant to set document JSON
 * @param {*} setError Constant to catch error 
 * @returns An array of documents from tracking branch
 */
export function GetDocumentByBranches(client, branch, documentID, setValue, setError){
    const [result, setResult] = useState(false)

    async function getDocument() {
        try{
            const clientCopy = client.copy()
            clientCopy.checkout(branch)
            let value = await clientCopy.getDocument({id: documentID})
            if(setValue) setValue(value)
            
        }
        catch(err){
           if(setError) setError(err.message)
           if(setValue) setValue(false)
       }
    }

    useEffect(() => {
        if (documentID) getDocument()
    }, [documentID])

    return result
}

    
