import React, {useState} from "react"
import {TopMenu} from '../components/TopMenu'
import {Container, Row} from "react-bootstrap"
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import {CHANGE_REQUEST_INFO} from "../mockUp/changeRequest"
import { DiffViewer } from "../components/DiffViewer"

const EachRequest = ({setShowDiff}) => {
    let listElements=[]

    function handleCRClick (e) {
        if(setShowDiff) setShowDiff(true)
    }

    CHANGE_REQUEST_INFO.map(creq => {
        listElements.push(
            <ListGroup.Item key={creq.id} onClick={handleCRClick}>
                {creq.message}
            </ListGroup.Item>
        )
    })
    return listElements
}

const CRLists = ({setShowDiff}) => {
    return <Container className="mt-5 mb-5">
        <Row className="p-2">
        <Card >
            <ListGroup variant="flush">
                <EachRequest setShowDiff={setShowDiff}/>
            </ListGroup>
        </Card>
        </Row>
    </Container>
}

const View = ({setShowDiff, showDiff}) =>{
    if(showDiff) return <DiffViewer setShowDiff={setShowDiff}/>
    return <CRLists setShowDiff={setShowDiff}/>
}

export const ChangeRequests = () => {

    const [showDiff, setShowDiff]=useState(false)

    return <Container fluid bg="dark" >
        <TopMenu/>
        <View setShowDiff={setShowDiff} showDiff={showDiff}/>
    </Container>
}