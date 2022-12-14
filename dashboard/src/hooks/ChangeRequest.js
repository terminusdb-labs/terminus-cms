import React, {useState} from "react";
import { ClientObj } from "../cms-init-client"
import {errorMessageFormatter} from "../utils/errorMessage"

export function ChangeRequest(){  
    const { client,currentChangeRequest, setCurrentCRObject } = ClientObj() 
    const [loading, setLoading] = useState(false)
    const [errorMessage, setError] = useState(false)
    const [changeRequestList, setChangeRequestList]  = useState([])

    const createChangeRequest = async(branchName, message) =>{
        try{
            setLoading(true)
        const payload = {tracking_branch:branchName,
                        original_branch:"main",
                        message:message,
                        author:client.user()}
        const result = await client.sendCustomRequest("POST", 'http://localhost:3035/changes',payload)
        return result.change_request_id
        }catch(err){
            const errMessage = errorMessageFormatter(err)
            setError(errMessage)
            return false
        }finally{
            setLoading(false)
        }
    }

    const updateChangeRequestStatus = async(message, status="Submitted") =>{
        try{
            setLoading(true)
            const payload = {message,status}
            await client.sendCustomRequest("PUT", `http://localhost:3035/changes/${currentChangeRequest}`,payload)
            return true
        }catch(err){
            const errMessage = errorMessageFormatter(err)
            setError(errMessage)
            return false
        }finally{
            setLoading(false)
        }  
    }

    const getChangeRequestList = async(branchName, message) =>{
        try{
            setLoading(true) 
            const result = await client.sendCustomRequest("GET", 'http://localhost:3035/changes')
            //console.log("result ** ", result)
            setChangeRequestList(result)
        }catch(err){
            const errMessage = errorMessageFormatter(err)
            setError(errMessage)
        }finally{
            setLoading(false)
        }     
    }

    const getChangeRequestByID = async(id) =>{
        try{ 
            setLoading(true) 
            const payload = {id}
            const result = await client.sendCustomRequest("GET", 'http://localhost:3035/changes', payload)
            if(setCurrentCRObject) {
                result.map(res=>{
                    if(res["@id"] === `ChangeRequest/${id}`){
                        setCurrentCRObject(res) 
                    }
                })
            }
        }catch(err){
            const errMessage = errorMessageFormatter(err)
            setError(errMessage)
        }finally{
            setLoading(false)
        }     
    }
    

    return {
        loading,
        setError,
        errorMessage,
        changeRequestList,
        createChangeRequest,
        getChangeRequestList,
        updateChangeRequestStatus,
        getChangeRequestByID
    }

}
