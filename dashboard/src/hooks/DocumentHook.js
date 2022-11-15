import React, {useState,useEffect} from "react";
import * as actions from "../components/constants"
import {extractID} from "../components/utils";

// create a new document
export function CreateDocumentHook(client, document, mode, setLoading, navigate, setErrorMsg) {
    const [result, setResult] = useState(false)
 
    async function addDocument() {
        try{
            setLoading(true)
            const res = await client.addDocument(document, null, client.db())
            let type=document["@type"]
            setResult(res)
            if(navigate) navigate(`/documents/${type}`)
            setLoading(false)
        }
        catch(err){ 
            setLoading(false)
            if(setErrorMsg) setErrorMsg(err.message)
       }
    }

    useEffect(() => {
        if (Object.keys(document).length && mode === actions.CREATE) addDocument()
    }, [document])

    return result
}


// delete documents
export function DeleteDocumentHook(client, documentId, type, mode, navigate, updated, setLoading, setErrorMsg) {
    const [result, setResult] = useState(false)

    async function deleteDocument() {
        try{
            setLoading(true)
            let params={}
            params['id'] = documentId
            let commitMsg=`Deleting document ${documentId}` 
            const res = await client.deleteDocument(params, client.db(), commitMsg)
            if(navigate) navigate(`/documents/${type}`)
            setLoading(false)
        }
        catch(err){
            if(setErrorMsg) setErrorMsg(err.message)
            setLoading(false)
       }
    }

    useEffect(() => {
        if (documentId && mode === actions.DELETE) deleteDocument()
    }, [documentId, updated])

    return result
}

export function GetDocumentHook(client, documentId, mode, setData, updated){// setLoading, setSuccessMsg, setErrorMsg) {
        const [result, setResult] = useState(false)
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState(false)
    
        async function getDocument() {
            try{
                let params={}
                params['id']=documentId
                setLoading(true)
                const res = await client.getDocument(params, client.db())
                if(setData) setData(res)
                setResult(res)
                setLoading(false)
                return res
            }
            catch(err){
                setLoading(false)
                setErrorMsg(err.message)
           }
        }
    

        useEffect(() => {
            if (documentId && updated && mode === actions.VIEW) getDocument()
        }, [documentId, updated])
    
        return result
    }

// edit documents
export function EditDocumentHook(client, extractedUpdate, mode, setLoading, setUpdated, setView) {
    const [result, setResult] = useState(false)

    async function updateDocument() {
        try{

            let params={}
            let update = extractedUpdate
            let documentId = extractedUpdate["@id"]
            let commitMsg=`Updating document ${documentId}`
            setLoading(true)
            const res = await client.updateDocument(update, params, client.db(), commitMsg)
            setLoading(false)
            if(setView) setView("View")
            // use updated constant to refresh updated view in UI 
            if(setUpdated) setUpdated(Date.now()) 
        }
        catch(err){
           //setErrorMsg(err.message)
           //setLoading(false)
           console.log("err.message", err.message)
       }
    }

    useEffect(() => {
        if (extractedUpdate && extractedUpdate.hasOwnProperty("@id") && mode === actions.EDIT) updateDocument()
    }, [extractedUpdate])

    return result
}

/**
 * 
 * @param {*} client TerminusDB Client
 * @param {*} changeRequestID Change Request ID
 * @param {*} setError Constant to catch error 
 * @returns diff list from branches
 */
export function GetDiffList(client, changeRequestID, setError){
    const [result, setResult] = useState(false)

    async function getDiffList() {
        try{
            let id = extractID(changeRequestID)
            const result = await client.sendCustomRequest("GET", `http://localhost:3035/changes/${id}/diff`)
            setResult(result)
        }
        catch(err){
            setError(err.message)
       }
    }

    useEffect(() => {
        if (changeRequestID) getDiffList()
    }, [changeRequestID])

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
export function GetDocumentByBranches(client, branch, documentID, setValue, setError, refresh){
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
        if (documentID && refresh) getDocument()
    }, [documentID, refresh])

    return result
}



