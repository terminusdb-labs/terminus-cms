import React from "react"
import {Container, Row, Button} from "react-bootstrap"

export const DiffViewer = ({setShowDiff}) => {

    function handleBack(e) {
        if(setShowDiff) setShowDiff(false)
    }

    return <Container className="mt-5 mb-5">
        <Row className="p-2">
            <Button variant="primary" onClick={handleBack}>Change Requests List</Button>
        </Row>
    </Container>
}
