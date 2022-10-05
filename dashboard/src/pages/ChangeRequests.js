import React, { useState, useEffect } from "react";
import {Container , Card, Button, ListGroup,Badge} from "react-bootstrap"
import { Link, useParams, useNavigate } from "react-router-dom";
import { ClientObj } from "../cms-init-client"
import { Allotment } from "allotment";
import { TopMenu } from "../components/TopMenu";
import {ChangeRequest} from "../hooks/ChangeRequest"
import {VscGitPullRequestDraft} from "react-icons/vsc"
import {VscGitPullRequest} from "react-icons/vsc"


export const ChangeRequests = () => {
    const { client } = ClientObj()
    const {loading,errorMessage,setError,getChangeRequestList,requestResult} =  ChangeRequest()

    useEffect(() => {
        if(client) getChangeRequestList()
    }, [client])


    const navigate = useNavigate()

    const goToDiffPage = () =>{
        navigate("/change_requests/test00999999")
    }

    const formatListItem=()=>{
        return requestResult.map(item=>{
            return  <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start">
            <div className="ms-2 me-auto">
              <div className="fw-bold"></div>
              Cras justo odio
            </div>
            <Badge bg="primary" pill>
              14
            </Badge>
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
						<Card.Header></Card.Header>
						<Card.Body>
							<ListGroup as="ol" >
								<ListGroup.Item
								as="li"
								className="d-flex justify-content-between align-items-start"
								>
								<VscGitPullRequestDraft/>
								<div className="ms-2 me-auto">
									<div className="fw-bold">Internally rename proposal-* to transform-* in preset-env</div>
								<span className="text-muted">opened 4 days ago by nicolo-ribaudo
							• Approved</span>
								</div>
								<Badge bg="success" pill>
									14 commits
								</Badge>
								<Badge bg="primary" pill>
									status open
								</Badge>
								</ListGroup.Item>
								<ListGroup.Item action
								onClick={goToDiffPage}
								
								className="d-flex justify-content-between align-items-start"
								>
									<VscGitPullRequest className="text-success"/>
								<div className="ms-2 me-auto">
									<div className="fw-bold">Subheading</div>
									Cras justo odio
								</div>
								<Badge bg="success" pill>
									14 commits
								</Badge>
								<Badge bg="warning" pill>
									status submitted:new to be merged
								</Badge>
								</ListGroup.Item>
								<ListGroup.Item
								as="li"
								className="d-flex justify-content-between align-items-start"
								>
								<div className="ms-2 me-auto">
									<div className="fw-bold">Subheading</div>
									Cras justo odio
								</div>
								<Badge bg="primary" pill>
									14
								</Badge>
								</ListGroup.Item>
							</ListGroup>
						</Card.Body>
					</Card>
				</Container>
			</Allotment.Pane>
		</Allotment>
	</Container>  

}