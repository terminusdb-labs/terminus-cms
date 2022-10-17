import React, {useState} from 'react'
import {Container, Row, Col} from "react-bootstrap"
import {TopMenu} from '../components/TopMenu'
import {useParams} from 'react-router-dom'
import {GetDiffList} from "../hooks/DocumentHook"
import {ClientObj} from "../cms-init-client"
import {DiffView} from "../components/DiffView"
import Badge from 'react-bootstrap/Badge'
import {BiGitBranch} from "react-icons/bi"
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import {DIFFS, MESSAGES} from "../components/constants"
import {Messages} from "../components/Messages"

const DocumentModifiedCount = ({documentModifiedCount}) => {
    if(documentModifiedCount > 0) return <h6 className="text-muted fw-bold mt-3 mb-3">
        {`${documentModifiedCount} documents changed`}
    </h6>

    return <h6 className="text-muted fw-bold mt-3 mb-3">
        {`No documents changed`}
    </h6>
}

const BranchCRMessage = ({trackingBranch, originBranch}) => {
    return <React.Fragment>
        <Badge bg="success" className="float-right fw-bold mr-2">{trackingBranch}</Badge>
        <BiGitBranch className="text-muted float-right mr-2"/>
        <strong className="text-muted fw-bold float-right mr-2">|</strong>
        <Badge bg="danger" className="float-right fw-bold mr-2" >{originBranch}</Badge>
        <BiGitBranch className="text-muted float-right mr-2"/>
    </React.Fragment>
}

export const ChangeDiff = () => {

    const {
        client
    } = ClientObj()

    if(!client) return <div/>

    const {id} = useParams() 
    const [key, setKey] = useState(DIFFS)
   
    const result = GetDiffList(client, id)  

    let documentModifiedCount = result ? result.length : 0

    return <Container fluid className="p-0 flex-row h-100" bg="dark" >
        <TopMenu showSearchBar={false}/>
        <Container>
            <br/><br/>
            <Tabs
                id="change_request_tabs"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3">
                <Tab eventKey={DIFFS} title={DIFFS}>
                    <Row className="w-100">
                        <Col md={6}>
                            {result && <DocumentModifiedCount documentModifiedCount={documentModifiedCount}/>}
                        </Col>
                            <Col md={6}>
                        <BranchCRMessage trackingBranch={id} originBranch={"main"}/>
                        </Col>
                    </Row> 
                    <DiffView diffs={result}/> 
                </Tab>
                <Tab eventKey={MESSAGES} title={MESSAGES}>
                    <Messages/>
                </Tab>
            </Tabs>
        </Container>                 
    </Container>
}
