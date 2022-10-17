import React, {useState} from "react"
import {Card, Button} from "react-bootstrap"
import {useParams} from "react-router-dom"
import {ClientObj} from "../cms-init-client"
import "allotment/dist/style.css"
import {FrameViewer} from "@terminusdb/terminusdb-documents-ui"
import {GetDocumentHook, EditDocumentHook} from "../hooks/DocumentHook"
import {CreateChangeRequestModal} from "../components/CreateChangeRequestModal"

export const DocumentInteface = () => {
    const {type, id} = useParams()
    const { 
        client, 
        frames, 
        updateBranch 
    } = ClientObj()

    const [viewMode, setView] = useState("View" )
    const viewSubmit = viewMode === "Edit" ? false : true

    const [showModal, setShowModal] = useState(false)

    // constants for editing document 
    const [extracted, setExtracted]=useState(false)
    const [loading, setLoading]=useState(false)
    
    let documentID=`${type}/${id}`

    // make better check the encoding
    const {result} = GetDocumentHook(client, documentID) || null

    // edit document hook
    const editResult = EditDocumentHook(client, extracted, setLoading) 

    if (!frames || !result) return <div/>
   
    const updateViewMode =(newBranchName,changeRequestId)=>{
        updateBranch(newBranchName,changeRequestId)
        setView("Edit")
    }

    // create a change request before editing document
    const startEditMode = () => {
        if (client.checkout() === "main") {
            setShowModal(true)
        } else {
            setView("Edit")
        }
    }

    // function which extracts data from document form 
    function handleSubmit(data) {
        console.log("data", data)
        setExtracted(data)
    }
   
    return <main className="content mt-5 w-100 document__interface__main">
        {showModal && <CreateChangeRequestModal showModal={showModal} 
            setShowModal={setShowModal} 
            updateViewMode={updateViewMode}/>}
        <Card className="ml-5 mr-5">
            <Card.Header className="justify-content-between d-flex w-100 text-break">
                <span className="float-left d-flex">
                    <h6>
                        <strong className="text-success ml-1">{viewMode}: {type}/{id}</strong>
                    </h6>
                </span>
                {viewMode === "View" && <Button variant="light" 
                    type="button" 
                    title="Form View" 
                    onClick={(e) => startEditMode()} 
                    className="btn-sm btn d-flex text-dark">
                    Edit
                </Button>}
            </Card.Header>
            <Card.Body className="text-break">
                <FrameViewer frame={frames}
                    // uiFrame={uiFrame}
                    type={type}
                    mode={viewMode}
                    onSubmit={handleSubmit}
                    //onSelect={onSelect} 
                    formData={result}
                    hideSubmit={viewSubmit}
                    // onTraverse={onTraverse}
                />
            </Card.Body>
        </Card>
    </main>
}