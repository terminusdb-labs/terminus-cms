import React, {useState, useEffect} from "react"
import {ClientObj} from "../cms-init-client"
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button"
import {ChangeRequest} from "../hooks/ChangeRequest"
import ProgressBar from 'react-bootstrap/ProgressBar'
import {
    extractID, 
    getDays
} from "./utils"
import {VscCommentDiscussion} from "react-icons/vsc"
import {Loading} from "./Loading"
import {MessageBox} from "./MessageBox"

const CommentSection = () => {
    const {
        currentCRObject
    } = ClientObj()

    if (!currentCRObject.hasOwnProperty("messages")) 
        return <div className="mt-2">No messages to display ...</div>

    let elements=[]

    if(Array.isArray(currentCRObject["messages"])) {
        currentCRObject["messages"].slice(0).reverse().map(curr => {
            elements.push(
                <React.Fragment>
                    {curr.text}
                    <Card.Text className="text-muted">{getDays(curr.timestamp)} days ago by {curr.author} </Card.Text>
                    <hr/>
                </React.Fragment>
            )
        })
    }
    return <Card className="mb-3 w-100 mt-2 p-5">{elements}</Card>
}

/*export const MessageBox = ({message, setMessage, onAddComment, placeholder, buttonText, loading}) => {
    return <Form.Group className="mb-3" controlId="form_change_request_textarea">
        <Form.Control as="textarea" 
            rows={5} 
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            style={{color: "white"}}
            className="bg-dark" 
            placeholder={placeholder}/>
        <Button className="bg-info text-dark btn-sm fw-bold float-right mt-2 mb-2 d-flex" 
            disabled={loading}
            onClick={onAddComment}>
            {loading ? <Loading message={buttonText}/> : buttonText} 
        </Button>
    </Form.Group>
}*/

const AddNewMessage=()=> {
    const {
        currentCRObject,
        setCurrentCRObject
    } = ClientObj()
    const {
        updateChangeRequestStatus,
        getChangeRequestByID,
        loading
    } =  ChangeRequest() 
    const [comment, setComment]=useState("")
    const [add, setAdd]=useState(false)

    useEffect(() => {
        async function updateMessages() {
            await updateChangeRequestStatus(comment, currentCRObject.status)
            let id=extractID(currentCRObject["@id"])
            await getChangeRequestByID(id)
            setComment("")
        }
        if(comment!=="") updateMessages()
    }, [add])

    function addComment() {
        setAdd(Date.now())
    }

    let addButton = () => {
        return <Button className="bg-info text-dark btn-sm fw-bold float-right mt-2 mb-2 d-flex" 
            disabled={loading}
            onClick={addComment}>
            {loading ? <Loading message={buttonText}/> : buttonText} 
        </Button>
    }

    return <Form className="mt-4 new__message__container mb-4">
        {loading && <ProgressBar variant="info" animated now={100}/>}
        <Form.Group className="mb-3" controlId="form_change_request_textarea">
            <MessageBox message={comment} 
                placeholder="Add a new Comment or Message ..."
                setMessage={setComment} 
                button={addButton}/>
        </Form.Group>
    </Form>
}

export const Messages = () => {

    return <React.Fragment>
        <AddNewMessage/>
        <br/>
        <h5 className="fw-bold text-muted mt-3 mb-3">
            <VscCommentDiscussion/> Previous Messages
        </h5>
        <CommentSection/>
    </React.Fragment>
  
}