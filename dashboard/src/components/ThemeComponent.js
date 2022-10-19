import React, {useState, useEffect} from "react"
import {ClientObj} from "../cms-init-client"
import {ExecuteQuery} from "../hooks/ExecuteQuery"
import {getThemesQuery, getLegoSetByTheme} from "../hooks/queries"
import Card from 'react-bootstrap/Card'
import {Row, Col, ProgressBar, Alert, Button} from 'react-bootstrap'
import {BrowseObj} from "../hooks/BrowseContext"
import {THEME, LEGO_SET} from "./constants"
import {BiArrowBack} from "react-icons/bi"
import Stack from 'react-bootstrap/Stack'

const ThemeProvider = ({themes}) => {
    if(!themes) return <div/>
    const {
        currentDocument,
        setCurrentDocument,
        themeID,
        setThemeID,
        loading, 
        setLoading
    } = BrowseObj()
    

    let elements=[]

    function displayLegoSet(id) {
        setLoading(true)
        setThemeID(id)
    }

    themes.map(theme => {
        elements.push(
            <Col md={2} className="mb-3">
                <Card className="theme__card"
                    onClick={(e) => displayLegoSet(theme["Themes"])} 
                    key={theme["Name"]["@value"]}>
                    <Card.Img variant="top" src={theme["Images"]["@value"]} />
                    {loading && theme["Themes"]===themeID && <ProgressBar variant="info" animated now={100} style={{height: "5px"}}/>}
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

const LegoSetProvider = ({legoSets}) => {
    if(!legoSets) return <div/>
    const {
        currentDocument,
        setCurrentDocument,
        setThemeID,
    } = BrowseObj()
    

    let elements=[]
    legoSets.map(set => {
        elements.push(
            <Col md={2} className="mb-5">
                <Card className="lego__set__card theme__card" 
                    id={set["Name"]["@value"]}>
                    <div className="lego__set__image__div"></div>
                    <Card.Body>
                        <small className="fw-bold">{set["Name"]["@value"]}</small>
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
        themeID,
        setThemeID,
        setCurrentDocument,
        setLoading
    } = BrowseObj()

    const [errorMsg, setErrorMsg]=useState(false)
    const [query, setQuery]=useState(false)
    const [legoSetQuery, setLegoSetQuery]=useState(false)

    let results = ExecuteQuery(client, query, null, setErrorMsg)
    let lego_set_results = ExecuteQuery(client, legoSetQuery, null, setErrorMsg)

    //console.log("lego_set_results", lego_set_results, themeID)

    useEffect(() => {
        let q = getThemesQuery()
        setQuery(q)
    }, [client]) 

    useEffect(() => { 
        if(themeID) {
            let q = getLegoSetByTheme(`${themeID}`)
            setLegoSetQuery(q)
        }
    }, [themeID])

    useEffect(() => {
        if(lego_set_results.length>0) setCurrentDocument(LEGO_SET)
    }, [lego_set_results])

    function goBackThemes() {
        setLoading(false)
        setThemeID(false)
        setLegoSetQuery(false)
        setCurrentDocument(THEME)
    }

    if(!results) return <span>
        Loading Themes ... 
        <ProgressBar variant="info" animated now={100}/>
    </span>

    if(errorMsg) return <Alert variant={"danger"}>
        {errorMsg}
    </Alert>

    if(currentDocument === THEME)
        return <React.Fragment>
            <h5 className="fw-bold text-muted mt-3 mb-3">
                Browse through Themes
            </h5>
            <ThemeProvider themes={results}/>
        </React.Fragment>

    if(currentDocument === LEGO_SET)
        return <React.Fragment>
            <Stack direction="horizontal" gap={3} style={{width: "98%"}}>
                <h5 className="fw-bold text-muted mt-3 mb-3">
                    Browse through Lego Sets
                </h5>
                <Button className="btn-sm bg-light text-dark fw-bold ms-auto" onClick={goBackThemes}>
                    <BiArrowBack className="mr-2"/>
                    Go Back to Themes
                </Button>
            </Stack>
            <LegoSetProvider legoSets={lego_set_results}/>
        </React.Fragment>

    return <>Not sure whats going on ...</>
}