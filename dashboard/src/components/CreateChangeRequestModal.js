import React, {useRef, useState} from "react"
import {Alert, Modal, Button, Form} from "react-bootstrap" 
import {ChangeRequest} from "../hooks/ChangeRequest"


export const CreateChangeRequestModal = ({showModal, setShowModal , updateViewMode}) => { 
    const nameRef = useRef(null);
    const messageRef = useRef(null);
    const {loading,errorMessage,setError,createChangeRequest} =  ChangeRequest()
    
    const closeModal = () => setShowModal(false)


    const runCreate = async () => {
        const name = nameRef.current.value
        const message = messageRef.current.value
        if(!name || name === "" || !message || message === "") {
            setError("Change request name and message are mandatory")
            return
        }else{
            const done = await createChangeRequest(name, message)         
            if(done){
                nameRef.current.value = ""
                messageRef.current.value = ""
                updateViewMode(name)
                setShowModal(false)
            }                  
        }
    }

 
    //<Loading message={`Deleting Data Product ${dataProductDetails.label} ...`} type={PROGRESS_BAR_COMPONENT}/>}
    return <Modal size="lg" className="modal-dialog-right" show={showModal} onHide={closeModal}>
        <Modal.Header>
            <Modal.Title className="text-success mt-3 mb-3">Starting a new change request</Modal.Title>
            <Button variant="close" aria-label="Close" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body className="p-5">
            {errorMessage && 
             <Alert variant="danger"  onClose={() => setError(false)} dismissible>{errorMessage}</Alert>}
            <Form>
                <Form.Group className="mb-3">
                    <Form.Control required 
                        ref={nameRef}
                        id="add_changerequest_name" 
                        type="text"
                        placeholder={`Please type the change request name`} />
                   
                </Form.Group>
                <Form.Group>
                    <Form.Control required 
                        ref={messageRef}
                        id="add_message" 
                        type="text"
                        placeholder={`Please type a message`} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button
                disabled={loading}
                id ="add_element_button"
                variant="info" 
                title={`Start a change request`} 
                onClick={runCreate}>{loading ? 'Sending Request ...' : "Start a change request"} 
            </Button>
        </Modal.Footer>
    </Modal>
}

