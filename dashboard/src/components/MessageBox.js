import React from "react"
import Form from 'react-bootstrap/Form'

export const MessageBox = ({message, setMessage, placeholder, button}) => {

    function handleMessage(e) {
        if(setMessage) {
            setMessage(e.target.value)
        }
    }

    return <Form.Group className="mb-3" controlId="form_change_request_textarea">
        <Form.Control as="textarea" 
            rows={5} 
            onChange={handleMessage}
            value={message}
            style={{color: "white"}}
            className="bg-dark" 
            placeholder={placeholder}/>
        {button}
    </Form.Group>
}