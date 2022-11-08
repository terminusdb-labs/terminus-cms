
import React from "react"
import {VscGitPullRequestDraft} from "react-icons/vsc"
import {VscGitPullRequest} from "react-icons/vsc"
import {VscCheck} from "react-icons/vsc" 
import Badge from "react-bootstrap/Badge"
import {
	OPEN,
	REJECTED,
	MERGED, 
	SUBMITTED
} from "./constants"

export const getDays = (timestamp) =>{
	const oneDay = 86400000
	return Math.round((Date.now() - timestamp)/oneDay)
}

export const iconTypes={
	[OPEN]:<VscGitPullRequestDraft className="text-muted mb-1"/>,
	[SUBMITTED]:<VscGitPullRequest className="text-success mb-1"/>,
	[REJECTED]:<VscGitPullRequest className="text-danger mb-1"/>,
    [MERGED] :<VscCheck className="text-success mb-1 "/>
}


export const status = {
	[OPEN]: <Badge bg="success text-dark" >{OPEN}</Badge>,
    [SUBMITTED]: <Badge bg="warning text-dark" >Review required</Badge>,
    [REJECTED]: <Badge bg="danger text-dark" >{REJECTED}</Badge>,
}

/** just get change request ID, remove "Changerequest/" from ID */
export function extractID(id) {
    let str= id.split("/") 
    return str[1]
}