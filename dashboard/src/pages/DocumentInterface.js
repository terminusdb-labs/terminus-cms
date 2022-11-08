import React, {useState, useEffect} from "react"
import {Card, Button} from "react-bootstrap"
import {useParams, useNavigate} from "react-router-dom"
import {ClientObj} from "../cms-init-client"
import "allotment/dist/style.css"
import {FrameViewer} from "@terminusdb/terminusdb-documents-ui"
import {
    GetDocumentHook, 
    EditDocumentHook, 
    CreateDocumentHook,
    DeleteDocumentHook
} from "../hooks/DocumentHook"
import {CreateChangeRequestModal} from "../components/CreateChangeRequestModal"
import Stack from 'react-bootstrap/Stack'
import {FaTimes} from "react-icons/fa"
import * as actions from "../components/constants"
import ProgressBar from 'react-bootstrap/ProgressBar'

const CreateHeader = ({mode, type, setCurrentMode}) => {
    return <Stack direction="horizontal" gap={3} className="w-100">
            <strong className="text-success ml-1 h6">{mode}: {type}</strong>
            <Button variant="light" 
                className="btn-sm text-dark ms-auto" 
                tilte={`Cancel and view list of ${type}`}
                onClick={(e) => setCurrentMode(actions.VIEW_LIST)}>
                <FaTimes/>
            </Button>
        </Stack>
}

const EditHeader = ({mode, type, id, setCurrentMode}) => {
    return <Stack direction="horizontal" gap={3} className="w-100">
        <strong className="text-success ml-1 h6">{mode}: {type}/{id}</strong>
        <Button variant="light" 
            className="btn-sm text-dark ms-auto" 
            tilte={`Cancel Edit and view list of ${type}`}
            onClick={(e) => setCurrentMode(actions.VIEW_LIST)}>
            <FaTimes/>
        </Button>
    </Stack>
}

const ViewHeader = ({mode, type, id, startCRMode}) => {

    function handleEdit(e) {
        startCRMode(actions.EDIT)
    }

    function handleDelete(e) {
        startCRMode(actions.DELETE)
    }

    return <Stack direction="horizontal" gap={3} className="w-100">
        <div>
            <strong className="text-success ml-1 h6">{mode}: {type}/{id}</strong>
        </div>
        <div className="ms-auto d-flex">
            <Button variant="light" 
                type="button" 
                title="Edit" 
                onClick={handleEdit} 
                className="btn-sm btn d-flex text-dark mr-2">
                Edit
            </Button>
            <Button variant="danger" 
                type="button" 
                title="Delete" 
                onClick={handleDelete} 
                className="btn-sm btn text-gray">
                Delete
            </Button>
        </div>
    </Stack>
}
 
const Header = ({mode, type, id, startCRMode, setCurrentMode}) => {
    let matchHeader ={
        [actions.CREATE] : <CreateHeader mode={actions.CREATE} type={type} setCurrentMode={setCurrentMode}/>,
        [actions.EDIT]   : <EditHeader mode={actions.EDIT} type={type} id={id} setCurrentMode={setCurrentMode}/>,
        [actions.VIEW]   : <ViewHeader mode={actions.VIEW} type={type} id={id} startCRMode={startCRMode}/>
    }
    return matchHeader[mode]
}

export const DocumentInterface = ({currentMode, setCurrentMode}) => { 
    const {type, id} = useParams()
    const { 
        client, 
        frames, 
        updateBranch 
    } = ClientObj()
    
    function reset(setUpdated, setCurrentMode) {
        setCurrentMode(actions.VIEW)
        return Date.now()
    }

    //const [currentMode, setCurrentMode] = useState((mode && mode === "Create") ? mode : "View")
    const [showModal, setShowModal] = useState(false)
    // constants for editing document 
    const [extracted, setExtracted]=useState(false)
    const [loading, setLoading]=useState(false)
    const [errorMsg, setErrorMsg]=useState(false)
    const [data, setData]=useState(false)
    const [refreshAfterDelete, setRefreshAfterDelete]=useState(false)
    const [updated, setUpdated]=useState((!currentMode) ? reset(setUpdated, setCurrentMode) : false)
  
    // no ID is created yet 
    let docID= currentMode === "Create" ? false : `${type}/${id}`
    const [documentID, setDocumentID] = useState(docID)
    const navigate = useNavigate()

    const createResult = CreateDocumentHook(client, extracted, currentMode, setLoading, setCurrentMode, setErrorMsg)
    const viewResult = GetDocumentHook(client, documentID, currentMode, setData, updated, setLoading, setErrorMsg) || null
    const editResult = EditDocumentHook(client, extracted, currentMode, setLoading, setUpdated, setCurrentMode)  
    const deleteResult = DeleteDocumentHook(client, documentID, currentMode, setCurrentMode, updated, setLoading, setErrorMsg)  
    
    useEffect(() => {
        if(currentMode === actions.CREATE) {
            startCRMode(currentMode)
            setData({})
        }
        else if(currentMode === actions.EDIT) {
            setCurrentMode(currentMode)
        }
        else if(currentMode === actions.VIEW) {
            setUpdated(Date.now())
        }
        else if(currentMode === actions.DELETE) {
            setUpdated(Date.now())
        }
        else if (currentMode === actions.VIEW_LIST) {
            navigate(`/documents/${type}`)
        }
    }, [currentMode])

    const updateViewMode =(newBranchName, changeRequestId)=>{
        updateBranch(newBranchName, changeRequestId)
        setCurrentMode(currentMode)
    }

    // create a change request before editing document
    const startCRMode = (mode) => {
        if (client.checkout() === "main") {
            setShowModal(true)
        } 
        setCurrentMode(mode)
    }

    // function which extracts data from document form 
    function handleSubmit(data) {
        setExtracted(data)
    }

    if(currentMode === actions.DELETE) {
        return <main className="content mt-5 w-100 document__interface__main">
            {showModal && <CreateChangeRequestModal showModal={showModal} 
                setShowModal={setShowModal} 
                updateViewMode={updateViewMode}/>}
                <span className="m-5">
                    {`deleting document ${documentID}`}
                    <ProgressBar variant="info" animated now={100} className="ml-5 mr-5"/>
                </span>
        </main>
    }

    return <main className="content mt-5 w-100 document__interface__main">
        {showModal && <CreateChangeRequestModal showModal={showModal} 
            setShowModal={setShowModal} 
            updateViewMode={updateViewMode}/>}
        <Card className="ml-5 mr-5">
            <Card.Header className="justify-content-between d-flex w-100 text-break">
                <Header mode={currentMode} type={type} id={id} startCRMode={startCRMode} setCurrentMode={setCurrentMode}/>
            </Card.Header>
            <Card.Body className="text-break">
                {Object.keys(data).length>0 && <FrameViewer frame={frames}
                    //uiFrame={uiFrame}
                    type={type}
                    mode={currentMode}
                    onSubmit={handleSubmit}
                    //onSelect={onSelect} 
                    formData={data}
                    hideSubmit={currentMode === actions.VIEW ? true : false}
                    // onTraverse={onTraverse}
                />}
                {Object.keys(data).length===0 && <FrameViewer frame={frames}
                    //uiFrame={uiFrame}
                    type={type}
                    mode={currentMode}
                    onSubmit={handleSubmit}
                    //onSelect={onSelect} 
                    formData={{}}
                    hideSubmit={false}
                    // onTraverse={onTraverse}
                />}
            </Card.Body>
        </Card>
    </main>
}