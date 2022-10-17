import {useEffect, useState} from 'react'

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

