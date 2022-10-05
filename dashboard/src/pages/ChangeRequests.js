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

    const goToDiffPage = (branchName) =>
    {
        navigate(`/change_requests/${branchName}`)
    }


    const iconTypes={
      "Open":<VscGitPullRequestDraft/>,
      "Submitted":<VscGitPullRequest className="text-success"/>,
      "Rejected":<VscGitPullRequest className="text-danger"/>
    }

    const status ={
      "Open":<Badge bg="success" pill>Status Open</Badge>,
      "Submitted": <Badge bg="warning" pill>Status submitted:new to be merged</Badge>,
      "Rejected":<Badge bg="danger" pill>Status Rejected</Badge>,
    }
  
    const getDays = (timestamp) =>{
      const oneDay = 86400000
      return Math.round((Date.now() - timestamp)/oneDay)
    }

    const formatListItem=()=>{
        return requestResult.map(item=>{
            if(item.status === "Merged") return ""
            const actions = item.status === "Submitted" ?  {action:true, onClick:()=>goToDiffPage(item['tracking_branch'])} : {}
            return  <ListGroup.Item {...actions}        
                className="d-flex justify-content-between align-items-start" key={item.id}>
                {iconTypes[item.status]}
              <div className="ms-2 me-auto">
                <div className="fw-bold">{item['tracking_branch']}</div>
                <span className="text-muted text-small">opened {getDays(item.creation_time)} days ago by {item['author']}</span>
              </div>
              {status[item.status]}
            </ListGroup.Item>
        })
    }

    

return (<Container fluid className="p-0 flex-row h-100" bg="dark" >
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
                {requestResult && formatListItem()}
              </ListGroup>
            </Card.Body>
          </Card>
         </Container>
        </Allotment.Pane>
        </Allotment>
      </Container>  
    )
}