import React from "react"
import {Row} from "react-bootstrap"

export const Loading = ({message}) => {

    return <React.Fragment>
        <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div> 
            <div className="bounce3"></div>
        </div>
        <Row className={`font-italic fw-bold mr-2`}>
            {message}
        </Row>
    </React.Fragment>
}