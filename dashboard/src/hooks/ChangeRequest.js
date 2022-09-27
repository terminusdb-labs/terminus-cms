import React, {useState,useEffect} from "react";

export function ChangeRequest(client, documentId){
    const [loading, setLoading] = useState(false)
    const [errorMessage, setError] = useState(false)
    const [requestResult, setRequestResult]  = useState(false)
    
    const createChangeRequest = async(branchName,message) =>{
        try{
            setLoading(true)
        const payload = {tracking_branch:branchName,original_branch:main}
        await client.sendCustomRequest("POST", 'http://localhost:3035/changes',{})
        return true
        }catch(err){
            setError(err.message)
            return false
        }finally{
            setLoading(false)
        }

    }

    return {loading,setError,errorMessage,requestResult,createChangeRequest}

}
