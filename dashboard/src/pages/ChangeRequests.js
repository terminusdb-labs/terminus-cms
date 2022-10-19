import React, {useEffect} from "react";
import {Container , Card, Button, ListGroup,Badge} from "react-bootstrap"
import {Link, useParams, useNavigate } from "react-router-dom";
import {ClientObj} from "../cms-init-client"
import {Allotment} from "allotment"
import {TopMenu} from "../components/TopMenu"
import {ChangeRequest} from "../hooks/ChangeRequest"
import {BiGitPullRequest} from "react-icons/bi"
import Stack from 'react-bootstrap/Stack'
import {
	OPEN,
	REJECTED,
	MERGED, 
	SUBMITTED
} from "../components/constants"
import ProgressBar from 'react-bootstrap/ProgressBar'
import {extractID, status, iconTypes, getDays} from "../components/utils"

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
    const {
		client,
        setCurrentCRObject,
		setCurrentChangeRequest
	} = ClientObj()
    const {
		getChangeRequestList,
		changeRequestList
    } =  ChangeRequest() 
  
    useEffect(() => {
        if(client) getChangeRequestList()
    }, [client])


    const navigate = useNavigate()

    const goToDiffPage = (changeRequestObject) => {
		let branchName=changeRequestObject['tracking_branch'] 
		setCurrentCRObject(changeRequestObject)
		let id=extractID(changeRequestObject["@id"])
        setCurrentChangeRequest(id)
        navigate(`/change_requests/${branchName}`)
    }
	
  
    const countType = {[OPEN] : 0 , [SUBMITTED]:0, [REJECTED]:0, [MERGED]:0 }

    const getHeader = () =>{
      	changeRequestList.forEach(item=> {
        	countType[item.status] = countType[item.status]+1
    })

    return  <React.Fragment>
		<Stack direction="horizontal" gap={3}>
			<div className="">
				<small className="text-gray fw-bold">{iconTypes[OPEN]} <span className="mr-5">{countType[OPEN]} {OPEN}</span> </small>           
				<small className="text-gray fw-bold">{iconTypes[SUBMITTED]} <span className="mr-5" >{countType[SUBMITTED]} {SUBMITTED}</span> </small>
				<small className="text-gray fw-bold">{iconTypes[MERGED]} <span className="mr-5">{countType[MERGED]} {MERGED}</span> </small>
				<small className="text-gray fw-bold">{iconTypes[REJECTED]} <span className="mr-5">{countType[REJECTED]} {REJECTED}</span></small>
			</div>
			<div className="ms-auto d-flex">
				<small className="text-gray fw-bold mr-2">Change Requests </small>
				<Badge bg="dark text-light">{changeRequestList.length}</Badge>
			</div>
		</Stack>
		</React.Fragment>

   }
    
    const formatListItem=()=>{
        return changeRequestList.map(item=>{
		
            if(item.status === "Merged") return ""
            const actions = item.status === "Submitted" ?  {action:true, onClick:()=>goToDiffPage(item)} : {}
            return  <ListGroup.Item {...actions}        
                className="d-flex justify-content-between align-items-start" key={item.id}>
                {iconTypes[item.status]}
              	<div className="ms-2 me-auto">
					<div className="fw-bold text-gray">
						{item['tracking_branch']}
					</div>
					<small className="text-muted text-small fw-bold">
						opened {getDays(item.creation_time)} days ago by {item['creator']}
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
							{changeRequestList && getHeader()}
						</Card.Header>
						<Card.Body className="p-0">
							<ListGroup as="ol" >
								{changeRequestList.length===0 && <ProgressBar variant="info" animated now={100}/>}
								{changeRequestList && formatListItem()}
							</ListGroup>
						</Card.Body>
					</Card>
         		</Container>
        	</Allotment.Pane>
        </Allotment>
    </Container>  
    
}