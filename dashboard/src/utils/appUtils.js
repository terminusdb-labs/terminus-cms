export function formatErrorMessage (err){
	let message = err.message
	if(err.data && err.data["api:message"]){ 
		if( err.data["api:message"] === "Incorrect authentication information"){
			return "Incorrect authentication information, wrong username or password"
		}else if (err.data["api:status"] === "api:forbidden"){
			localStorage.removeItem("TerminusCMS-USER") 
			localStorage.removeItem("TerminusCMS-KEY")
			return "The User is not Authorised"
		}           
		message = err.data["api:message"]
		
	}else if (message.indexOf("Network Error")>-1){
		message = "Network Error! Unable to connect to the server"
	}
	return message
}
//viewportMargin: "Infinity",
export const MODEL_BUILDER_EDITOR_OPTIONS = {
    theme: "ayu-dark",
    height: "auto",
    mode: {
      name: "javascript",
      json: true,
      statementIndent: 2
    },
    lineNumbers: true,
    lineWrapping: true,
    indentWithTabs: false,
    tabSize: 2,
    readOnly:true
}