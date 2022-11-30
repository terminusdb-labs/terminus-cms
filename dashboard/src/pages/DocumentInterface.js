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
import * as CONST from "../components/constants"
import ProgressBar from 'react-bootstrap/ProgressBar'
import {DocumentsResultTable} from "../components/DocumentsResultTable"
import Alert from 'react-bootstrap/Alert'

const CloseButton = ({navigate, type}) => {
    return <Button variant="light" 
        className="btn-sm text-dark ms-auto" 
        tilte={`Cancel and view list of ${type}`}
        onClick={(e) => navigate(`/documents/${type}/`)}>
        <FaTimes/>
    </Button>
}

const CreateHeader = ({mode, type, navigate}) => {
    return <Stack direction="horizontal" gap={3} className="w-100">
            <strong className="text-success ml-1 h6">{mode}: {type}</strong>
            <CloseButton navigate={navigate} type={type}/>
        </Stack>
}

const EditHeader = ({mode, type, id, navigate}) => {
    return <Stack direction="horizontal" gap={3} className="w-100">
        <strong className="text-success ml-1 h6">{mode}: {type}/{id}</strong>
        <CloseButton navigate={navigate} type={type}/>
    </Stack>
}

const ViewHeader = ({mode, type, id, startCRMode}) => {

    function handleEdit(e) {
        startCRMode(CONST.EDIT)
    }

    function handleDelete(e) {
        startCRMode(CONST.DELETE)
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
 
const Header = ({mode, type, id, startCRMode, navigate}) => {
    let matchHeader ={
        [CONST.CREATE] : <CreateHeader mode={CONST.CREATE} type={type} navigate={navigate}/>,
        [CONST.EDIT]   : <EditHeader mode={CONST.EDIT} type={type} id={id} navigate={navigate}/>,
        [CONST.VIEW]   : <ViewHeader mode={CONST.VIEW} type={type} id={id} startCRMode={startCRMode}/>
    }
    return matchHeader[mode]
}

//{currentMode, setCurrentMode}
export const DocumentInterface = () => { 
    const {type, id} = useParams()
    const { 
        client, 
        frames, 
        updateBranch 
    } = ClientObj()
    
    function reset(setUpdated, setCurrentMode) {
        setCurrentMode(CONST.VIEW)
        return Date.now()
    }

    function getCurrentMode(id) {
        if(!id) return CONST.CREATE
        if(id) return CONST.VIEW
    }

    // no ID is created yet 
    let docID= id===CONST.CREATE_PATH ? false : `${type}/${id}`
    const [currentMode, setCurrentMode] = useState(getCurrentMode(docID))
    const [showModal, setShowModal] = useState(false)
    // constants for editing document 
    const [extracted, setExtracted]=useState({})
    const [loading, setLoading]=useState(false)
    const [errorMsg, setErrorMsg]=useState(false)
    const [data, setData]=useState(false)
    const [refreshAfterDelete, setRefreshAfterDelete]=useState(false)
    const [updated, setUpdated]=useState((!currentMode) ? reset(setUpdated, setCurrentMode) : false)
  
    

    const [documentID, setDocumentID] = useState(docID)
    const navigate = useNavigate()
 
    const createResult = CreateDocumentHook(client, extracted, currentMode, setLoading, navigate, setErrorMsg) 
    const viewResult = GetDocumentHook(client, documentID, currentMode, setData, updated, setLoading, setErrorMsg) || null
    const editResult = EditDocumentHook(client, extracted, currentMode, setLoading, setUpdated, setCurrentMode)  
    const deleteResult = DeleteDocumentHook(client, documentID, type, currentMode, navigate, updated, setLoading, setErrorMsg)  
    
    useEffect(() => {
        if(currentMode === CONST.CREATE) {
            startCRMode(currentMode)
            setData({})
        }
        else if(currentMode === CONST.EDIT) {
            setCurrentMode(currentMode)
        }
        else if(currentMode === CONST.VIEW) {
            setUpdated(Date.now())
        }
        else if(currentMode === CONST.DELETE) {
            setUpdated(Date.now())
        }
        else if (currentMode === CONST.VIEW_LIST) {
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

    if(currentMode === CONST.DELETE) {
        return <main className="content mt-5 w-100 document__interface__main">
            {showModal && <CreateChangeRequestModal showModal={showModal}
                type={type} 
                setShowModal={setShowModal} 
                updateViewMode={updateViewMode}/>}
                <span className="m-5">
                    {`deleting document ${documentID}`}
                    <ProgressBar variant="info" animated now={100} className="ml-5 mr-5"/>
                </span>
        </main>
    }

    const SearchComponent = ({setSelected, doctype}) => {
        return <DocumentsResultTable type={doctype} onRowClick={setSelected}/>
    }
  
    return <main className="content mt-5 w-100 document__interface__main">
        {showModal && <CreateChangeRequestModal showModal={showModal} 
            setShowModal={setShowModal} 
            type={type} 
            updateViewMode={updateViewMode}/>}
        {errorMsg && <Alert variant={"danger"} className="ml-5 mr-5">
            {errorMsg}
        </Alert>}
        <Card className="ml-5 mr-5 bg-secondary">
            <Card.Header className="justify-content-between d-flex w-100 text-break">
                <Header mode={currentMode} type={type} id={id} startCRMode={startCRMode} navigate={navigate}/>
            </Card.Header>
            <Card.Body className="text-break">
                {Object.keys(data).length>0 && <FrameViewer frame={frames}
                    //uiFrame={uiFrame}
                    type={type}
                    mode={currentMode}
                    onSubmit={handleSubmit}
                    onSelect={<SearchComponent/>}   
                    formData={data}
                    hideSubmit={currentMode === CONST.VIEW ? true : false}
                    // onTraverse={onTraverse}
                />}
                {Object.keys(data).length===0 && <FrameViewer frame={frames}
                    //uiFrame={uiFrame}
                    type={type}
                    mode={currentMode}
                    onSubmit={handleSubmit}
                    onSelect={<SearchComponent/>}   
                    formData={extracted}
                    hideSubmit={false}
                    // onTraverse={onTraverse}
                />}
            </Card.Body>
        </Card>
    </main>
}