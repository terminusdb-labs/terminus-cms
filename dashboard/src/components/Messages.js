import React from "react"
import {ClientObj} from "../cms-init-client"
import Card from 'react-bootstrap/Card'
import {getDays} from "../pages/ChangeRequests"
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button"

const Contents = () => {
    const {
        currentCRObject
    } = ClientObj()

    if (!currentCRObject.hasOwnProperty("messages")) 
        return <>No messages to display ...</>

    let elements=[]
    //console.log("currentCRObject", currentCRObject)

    if(Array.isArray(currentCRObject["messages"])) {
        currentCRObject["messages"].map(curr => {
            elements.push(
                <Card className="box arrow-left mb-3 w-100 mt-2">
                    {curr.text}
                    <Card.Text className="text-muted">{getDays(curr.timestamp)} days ago by {currentCRObject['author']} </Card.Text>
                </Card>
            )
        })
    }
    return elements
}

const AddNewMessage=()=> {
    return <Form className="mt-4 new__message__container">
        <Form.Group className="mb-3" controlId="form_change_request_textarea">
            <Form.Control as="textarea" 
                rows={5} 
                className="bg-dark text-gray" 
                placeholder="Add a new Comment or Message ..."/>
            <Button className="bg-info float-right mt-2 mb-2">Comment</Button>
        </Form.Group>
    </Form>
}

export const Messages = () => {

    return <React.Fragment>
        <Contents/>
        <AddNewMessage/>
    </React.Fragment>
  
}