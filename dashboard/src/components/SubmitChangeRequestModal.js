import React, {useRef, useState} from "react"
import {Alert, Modal, Button, Form} from "react-bootstrap" 
import {ChangeRequest} from "../hooks/ChangeRequest"

export const SubmitChangeRequestModal = ({showModal, setShowModal , updateParent}) => { 
    const nameRef = useRef(null);
    const messageRef = useRef(null);
    const {loading,errorMessage,setError,createChangeRequest} =  ChangeRequest()
    
    const closeModal = () => setShowModal(false)

    const runCreate = async () => {
        updateParent()
        /*const name = nameRef.current.value
        const message = messageRef.current.value
        if(!name || name === "" || !message || message === "") {
            setError("Change request name and message are mandatory")
            return
        }else{
            const done = await createChangeRequest(name, message)         
            if(done){
                nameRef.current.value = ""
                messageRef.current.value = ""
                updateParent(name)
                setShowModal(false)
            }                  
        }*/
    }

 
    //<Loading message={`Deleting Data Product ${dataProductDetails.label} ...`} type={PROGRESS_BAR_COMPONENT}/>}
    return <Modal size="lg" className="modal-dialog-right" show={showModal} onHide={closeModal}>
        <Modal.Header>
            <Modal.Title className="text-success mt-3 mb-3">Submit the Change Request for review</Modal.Title>
            <Button variant="close" aria-label="Close" onClick={closeModal} />
        </Modal.Header>
        <Modal.Body className="p-5">
            {errorMessage && 
             <Alert variant="danger"  onClose={() => setError(false)} dismissible>{errorMessage}</Alert>}
            <Form>
                <Form.Group>
                    <Form.Control required 
                        ref={messageRef}
                        id="add_message" 
                        as="textarea" rows={3}
                        placeholder={`Please type a message`} />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button
                disabled={loading}
                id ="add_element_button"
                variant="info" 
                title={`Submit change request`} 
                onClick={runCreate}>{loading ? 'Sending Request ...' : "Submit change request"} 
            </Button>
        </Modal.Footer>
    </Modal>
}

