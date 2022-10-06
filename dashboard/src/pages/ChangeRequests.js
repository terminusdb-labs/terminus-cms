import React, {useEffect} from "react";
import {Container , Card, Button, ListGroup,Badge} from "react-bootstrap"
import {Link, useParams, useNavigate } from "react-router-dom";
import {ClientObj} from "../cms-init-client"
import {Allotment} from "allotment";
import {TopMenu} from "../components/TopMenu";
import {ChangeRequest} from "../hooks/ChangeRequest"
import {VscGitPullRequestDraft} from "react-icons/vsc"
import {VscGitPullRequest} from "react-icons/vsc"
import {BiGitPullRequest} from "react-icons/bi"
import {
	OPEN,
	REJECTED,
	MERGED, 
	SUBMITTED
} from "../components/constants"

const GetChangeRequestSummary = ({changeRequestList}) => {
	if(!changeRequestList) return <div/>
	let openCRCount=0
	changeRequestList.map(crs => {
		if(crs.hasOwnProperty("status") && crs["status"] === OPEN) openCRCount+=1
	})
	return <h6 className="text-muted fw-bold">
		<BiGitPullRequest className="mr-2 mb-1"/>
		{`${openCRCount} Open`}
	</h6>
}

export const ChangeRequests = () => {
    const {client} = ClientObj()
    const {
		getChangeRequestList,
		changeRequestList
	}= ChangeRequest()

    useEffect(() => {
        if(client) getChangeRequestList()
    }, [client])


    const navigate = useNavigate()

    const goToDiffPage = (branchName) => {
        navigate(`/change_requests/${branchName}`)
    }

    const iconTypes={
      	[OPEN]:<VscGitPullRequestDraft className="text-muted mt-1"/>,
      	[SUBMITTED]:<VscGitPullRequest className="text-success mt-1"/>,
      	[REJECTED]:<VscGitPullRequest className="text-danger mt-1"/>
    }

    const status = {
        [OPEN]: <Badge bg="success" pill>{OPEN}</Badge>,
      	[SUBMITTED]: <Badge bg="warning" pill>Status submitted:new to be merged</Badge>,
      	[REJECTED]: <Badge bg="danger" pill>{REJECTED}</Badge>,
    }	
  
    const getDays = (timestamp) =>{
      const oneDay = 86400000
      return Math.round((Date.now() - timestamp)/oneDay)
    }
 
    const formatListItem=()=>{
        return changeRequestList.map(item=>{
            if(item.status === MERGED) return <div/>
            const actions = (item.status ===  SUBMITTED) ?  {action:true, onClick:()=>goToDiffPage(item['tracking_branch'])} : {}
            return  <ListGroup.Item {...actions}        
                className="d-flex justify-content-between align-items-start" key={item.id}>
                {iconTypes[item.status]}
              	<div className="ms-2 me-auto">
					<div className="fw-bold text-gray">
						{item['tracking_branch']}
					</div>
					<small className="text-muted text-small fw-bold">
						opened {getDays(item.creation_time)} days ago by {item['author']}
					</small>
				</div>
              	{status[item.status]}
            </ListGroup.Item>
        })
    }


	return <Container fluid className="p-0 flex-row h-100" bg="dark" >
		<Allotment vertical className='h-100'>
			<Allotment.Pane className="bg-grey"
				maxSize={48}
				minSize={48}
				>
				<TopMenu/>
			</Allotment.Pane>
			<Allotment.Pane >
				<Container className="mt-5">
					<Card>
						<Card.Header>
							<GetChangeRequestSummary changeRequestList={changeRequestList}/>
						</Card.Header>
						<Card.Body>
						<ListGroup as="ol" >
							{changeRequestList && formatListItem()}
						</ListGroup>
						</Card.Body>
					</Card>
				</Container>
			</Allotment.Pane>
		</Allotment>
	</Container>  
}