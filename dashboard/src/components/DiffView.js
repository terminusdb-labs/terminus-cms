import React, {useState} from "react"
import {ClientObj} from "../cms-init-client"
import Accordion from 'react-bootstrap/Accordion'
import {useParams} from 'react-router-dom'
import {DiffViewer} from '@terminusdb/terminusdb-documents-ui'
import Badge from 'react-bootstrap/Badge'
import {TbExchange} from "react-icons/tb"
import Stack from 'react-bootstrap/Stack'
import Pagination from 'react-bootstrap/Pagination'
import {DIFFS_PER_PAGE_LIMIT} from "./constants"
import {Row, Col} from "react-bootstrap"
import {GetDocumentByBranches} from "../hooks/DocumentHook"
import Alert from 'react-bootstrap/Alert'
import ProgressBar from 'react-bootstrap/ProgressBar'

/**
 * 
 * @param {*} diff diff list 
 * @returns 
 */
function getPropertyModifiedCount(diff) {
    let count=0
    for(var item in diff){
        if(item === "@id") continue
        if(item === "@type") continue
        count+=1
    }
    return count
}

/**
 * 
 * @param {*} branch origin branch
 * @returns React Element with branch badge
 */
const OriginHeader = ({branch}) => {
    return <Badge bg="danger" className="float-right fw-bold">{branch}</Badge>
}

/**
 * 
 * @param {*} branch tracking branch
 * @returns React Element with branch badge
 */
const TrackingHeader = ({branch}) => {
    return <Badge bg="success" className="float-right fw-bold">{branch}</Badge>
}

/**
 * 
 * @param {*} propertyModifiedCount count of properties modified for a document
 * @returns 
 */
function propertyModified (propertyModifiedCount) {
    if(propertyModifiedCount === 1) return `${propertyModifiedCount} property modified`
    return `${propertyModifiedCount} properties modified`
}


/**
 * 
 * @param {*} diffs diff list 
 * @param {*} trackingBranchDocumentList document list of tracking branch
 * @param {*} originBranchDocumentList document list of origin branch
 * @returns 
 */
export const DiffView = ({diffs}) => {
    const {frames, client} = ClientObj()
    const {id} = useParams()

    // pagination constants
    const [activePage, setActivePage]=useState(1)
    const [current, setCurrent]=useState(0)

    // document constants
    const [documentID, setDocumentID] =  useState(false)
    const [originalValue, setOriginalValue] =  useState(false)
    const [changedValue, setChangedValue] =  useState(false)

    // message constants 
    const [error, setError]=useState(false)

    let cValue=GetDocumentByBranches(client, id, documentID, setChangedValue, setError)
    let oValue=GetDocumentByBranches(client, "main", documentID, setOriginalValue, setError)
    
    let elements=[], paginationItems=[]


    let divide = diffs.length/DIFFS_PER_PAGE_LIMIT

    // function to handle on click of page
    function handlePagination(number) {
        if(number > activePage) {
            let newCurrent=current+DIFFS_PER_PAGE_LIMIT+1
            setCurrent(newCurrent)
        }
        else {
            let newCurrent=current-DIFFS_PER_PAGE_LIMIT-1
            setCurrent(newCurrent)
        }
        setActivePage(number) 
        
    }

    // populate pagination Item
    for (let number = 1; number <= divide; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={number === activePage} onClick={(e) => handlePagination(number)}>
                {number}
            </Pagination.Item>
        )
    }
      
    if(!diffs) return <span>
        Loading Diffs ... 
        <ProgressBar variant="info" animated now={100}/>
    </span>

    // onselect of diff accordian 
    function getDocumentStatesOnClick(clicked) {
        setDocumentID(clicked)
    }

    // looping through diff lists
    for(var start=current; start<=(current + DIFFS_PER_PAGE_LIMIT); start++) {
       
        if(start >= diffs.length) continue

        let propertyModifiedCount = getPropertyModifiedCount(diffs[start])

        elements.push(
            <React.Fragment>
                <Accordion classNames="mb-3 bg-secondary accordion__button"
                    id={diffs[start]["@id"]}
                    onSelect={getDocumentStatesOnClick}>
                    <Accordion.Item eventKey={diffs[start]["@id"]}>
                        <Accordion.Header className="w-100">
                            <Stack direction="horizontal" gap={3} className="w-100">
                                <div >
                                    <TbExchange className="text-muted mr-2"/>
                                    <small className="text-gray fw-bold">{diffs[start]["@id"]}</small>
                                </div>
                                <div className="ms-auto">
                                    <small className="text-warning col-md-10 text-right font-italic">
                                        {propertyModified(propertyModifiedCount)}
                                    </small>
                                </div>
                            </Stack>
                               </Accordion.Header>
                        <Accordion.Body>
                            {error && <Alert variant={"danger"}>
                                {error}
                            </Alert>}
                            {originalValue && changedValue && <DiffViewer 
                                oldValue={originalValue} 
                                newValue={changedValue}
                                oldValueHeader={<OriginHeader branch="main"/>}
                                newValueHeader={<TrackingHeader branch={id}/>}
                                frame={frames}
                                type={diffs[start]["@type"]}
                                diffPatch={diffs[start]}/>}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <br/>
            </React.Fragment>
        )
    }

    return <React.Fragment>
        {elements}
        <Row className="w-100">
            <Col/>
            <Col>
                <Pagination className="justify-content-center">{paginationItems}</Pagination>
            </Col>
            <Col/>
        </Row>
    </React.Fragment>
}
