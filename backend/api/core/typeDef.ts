
export type ChangeReqStatus = "Submitted" | "Open" | "Rejected" | "Merged"
export type MessageObj =  {"@type" : "Message", 
            "text":string,
            "timestamp":number,
            "author":string
            }

export type ChangeReqDoc = { 
    "@type" : "ChangeRequest",
    "origin_database" : string,
    "status" :  ChangeReqStatus ,
    "tracking_branch" : string,
    "original_branch" : string,
    "creator" : string, 
    "creation_time" : number,
    "messages": MessageObj[]
}

export type GetRequestQuery = {
    "type" : "ChangeRequest",
    "query": { "tracking_branch":string}
}