
export const errorMessageFormatter = (err) =>{
    const errData = err.data || {}
    if(errData["api:error"] && errData["api:error"]["@type"] === "api:BranchExistsError"){
       return  errData["api:message"]
    }

    return err.message
}