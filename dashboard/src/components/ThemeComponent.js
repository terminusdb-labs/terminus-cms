import React, {useState, useEffect} from "react"
import {ClientObj} from "../cms-init-client"
import {ExecuteQuery} from "../hooks/ExecuteQuery"
import {getThemesQuery, getLegoSetByTheme} from "../hooks/queries"
import Card from 'react-bootstrap/Card'
import {Row, Col, ProgressBar, Alert} from 'react-bootstrap'
import {BrowseObj} from "../hooks/BrowseContext"
import {THEME} from "./constants"

const ThemeProvider = ({themes}) => {
    if(!themes) return <div/>
    const {
        currentDocument,
        setCurrentDocument,
        setThemeID,
    } = BrowseObj()
    

    let elements=[]

    function displayLegoSet(id) {
        setThemeID(id)
    }

    themes.map(theme => {
        elements.push(
            <Col md={2} className="mb-3">
                <Card className="theme__card" 
                    onClick={(e) => displayLegoSet(theme["Name"]["@value"])} 
                    id={theme["Name"]["@value"]}>
                    <Card.Img variant="top" src={theme["Images"]["@value"]} />
                    <Card.Body>
                        <small className="fw-bold">{theme["Name"]["@value"]}</small>
                    </Card.Body>
                </Card>
            </Col>
        )
    })

    return <Row className="w-100 mt-5">
        {elements}
    </Row>
}

export const Themes = () => {
    const {client} = ClientObj()
    if(!client) return <div/>

    const {
        currentDocument,
        themeID
    } = BrowseObj()

    const [errorMsg, setErrorMsg]=useState(false)
    const [query, setQuery]=useState(false)
    const [legoSetQuery, setLegoSetQuery]=useState(false)

    let results = ExecuteQuery(client, query, null, setErrorMsg)
    let lego_set_results = ExecuteQuery(client, legoSetQuery, null, setErrorMsg)

    console.log("lego_set_results", lego_set_results, themeID)

    useEffect(() => {
        let q = getThemesQuery()
        setQuery(q)
    }, [client])

    useEffect(() => {
        let q = getLegoSetByTheme(`Theme/${themeID}`)
        setLegoSetQuery(q)
    }, [themeID])

    if(!results) return <span>
        Loading Themes ... 
        <ProgressBar variant="info" animated now={100}/>
    </span>

    if(errorMsg) return <Alert variant={"danger"}>
        {errorMsg}
    </Alert>

    if(currentDocument === THEME)
        return <React.Fragment>
            <h5>Browse through Themes</h5>
            <ThemeProvider themes={results}/>
        </React.Fragment>

    return <>Not sure whats going on ...</>
}