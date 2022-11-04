import {useEffect, useState} from 'react'
import {ClientObj} from "../cms-init-client"

//if you do not need remove this 
export function executeQuery(client, query, setResult, setLoading, setErrorMsg) {
    if(setLoading) setLoading(true)
    query.execute(client)
        .then((res) => {
            if(setResult) setResult(res)
            if(setLoading) setLoading(false)
            return res
        })
        .catch((err) => {
            if(setErrorMsg) setErrorMsg(err.message)
        })
}

export function ExecuteQuery(client, query, setLoading, setErrorMsg) {
    const [result, setResult] = useState(false)

    useEffect(() => {
        if (query) executeQuery(client, query, setResult, setLoading, setErrorMsg)
    }, [query])

    return result.hasOwnProperty("bindings") ? result.bindings : []
}

export function  ExecuteQueryHook (client){
    const [result, setResult] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const runQuery = async(query,formatResult,extraVars)=>{
        try{
            setLoading(true)
            const result = await client.query(query)
            let bindings = formatResult ? formatResult(result.bindings,extraVars) : result.bindings
            setResult(bindings)
        }catch(err){
            setError(err.message)
        }finally{
            setLoading(false)
        }
    }

    return {runQuery,loading,error,result}
}

