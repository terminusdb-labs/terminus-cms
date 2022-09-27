import TerminusClient from "@terminusdb/terminusdb-client"
import React, {useState,useEffect} from "react";
import {Allotment} from 'allotment'
import {Container, Nav,Row,Col,Card,Button} from "react-bootstrap"
//import {useNavigate} from "react-router-dom"
import {TopMenu} from '../components/TopMenu'
import { Link,useParams,useNavigate } from "react-router-dom";
import {ClientObj}  from "../cms-init-client"
import {WOQLTable,ControlledGetDocumentQuery} from '@terminusdb/terminusdb-react-table'
import "allotment/dist/style.css";
import {FrameViewer} from "@terminusdb/terminusdb-documents-ui"
import { GetDocumentHook } from "../hooks/DocumentHook";
import {CreateChangeRequestModal} from "../components/CreateChangeRequestModal"

export const DocumentInteface = () => {
    const {type,id} = useParams()
    const {client,frames} = ClientObj()
    const [showModal,setShowModal] = useState(false)
    const [viewMode,setView] = useState("View")
    // make better check the encoding
    const {result} = GetDocumentHook(client,`${type}/${id}`) || null
    if(!frames || !result  ) return ""

    const startEditMode = () =>{
        /*
        * if I'm in the main branch I need to create a change request before edit an document
        */
        if(client.checkout === "main"){
            setShowModal(true)
        }else{

        }
    }
    
/*
**  frame     - full json schema of a document
**  uiFrame   - ui json of a document
**  type      - document type of interest
**  mode      - create/ edit/ view
**  submitButton - submit button configuration json object
**  formData  - filled value of the document
**  onSubmit  - a function with have custom logic to process data submitted
**  hideSubmit - hides Submit button - this is helpfull when you want to display nested FrameViewers
**  onChange   - a function with custom logic to process data when form data is changed
**  onSelect   - a js function which gets back the selected value from selects
**  onTraverse - a js function which gets back the ID of a document on click
**  FieldTemplate - a js function which you can pass at root level of FrameViewer to alter look and feel of fields
**  language - language code parameters to support a wide variety of languages in Ui as defined in schema
*/
   return <main className="content mt-5 w-100"> 
            {showModal && <CreateChangeRequestModal showModal setShowModal setView/>}   
            <Card className="ml-5 mr-5"> 
            <Card.Header className="justify-content-between d-flex w-100 text-break">
                <span className="float-left d-flex ">
                    <h5>
                        <strong className="text-success ml-1">{type}/{id}</strong>
                    </h5>                   
                </span>
                <Button variant="light"  type="button" title="Form View" onClick={(e) => startEditMode()} className="btn-sm btn d-flex text-dark">                    
                    Edit
                 </Button>
            </Card.Header>
            <Card.Body className="text-break"> 
                <FrameViewer frame={frames}
                    // uiFrame={uiFrame}
                    type={type}
                    mode={viewMode}
                    //onSubmit={onSubmit}
                    //onSelect={onSelect} 
                    formData={result}
                    // FieldTemplate={FieldTemplate}
                    hideSubmit={true}
                    // onTraverse={onTraverse}
                    //prefix={"terminusd//schma#"}
                    />
            </Card.Body>
            </Card> 
        </main>
}