import React from "react"
import {
    COMMENT,
    APPROVE,
    REJECT,
} from "./constants"
import Dropdown from 'react-bootstrap/Dropdown'
import SplitButton from 'react-bootstrap/SplitButton'
import {CommentComponent} from "./CommentComponent"
import {ApproveComponent} from "./ApproveComponent"
import {RejectComponent} from "./RejectComponent"

const View = ({action, setKey}) => {
    if(action === COMMENT) return <CommentComponent setKey={setKey}/>
    else if (action === APPROVE) return <ApproveComponent/>
    else if (action === REJECT) return <RejectComponent/>
    return <div/>
}

export const ReviewComponent = ({setKey, action, setAction}) => {

    function handleAction (e) {
        if(e.target.text === COMMENT) setAction(COMMENT)
        else if(e.target.text === APPROVE) setAction(APPROVE)
        else setAction(REJECT)
    }
    
	return <React.Fragment>
       <SplitButton
            key={"end"}
            bsPrefix="btn btn-lg text-dark bg-light"
            id={`dropdown-button-drop-end`}
            drop={"end"}
            variant="light"
            title={"Submit Review"}>
            <Dropdown.Item eventKey={COMMENT} onClick={handleAction}>{COMMENT}</Dropdown.Item>
            <Dropdown.Item eventKey={APPROVE} onClick={handleAction}>{APPROVE}</Dropdown.Item>
            <Dropdown.Item eventKey={REJECT} onClick={handleAction}>{REJECT}</Dropdown.Item>
          </SplitButton>
        <View action={action} setKey={setKey}/>
    </React.Fragment>
        
}