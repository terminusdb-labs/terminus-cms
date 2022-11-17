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
import {ExecuteQueryHook} from "../hooks/ExecuteQuery"
import {useNavigate} from "react-router-dom"

const ThemeProvider = ({themes,onNodeClick}) => {  
    const elements = themes.map((theme,index) => {
            const name = theme.Name ? theme.Name['@value'] : ''
            const image = theme.Images ? theme.Images['@value'] : ''
            return <Col md={2} className="mb-3" key={`theme__${index}`}>
                    <Card className="theme__card"
                        onClick={(e) => onNodeClick(name)} >
                        <Card.Img variant="top" src={image} />
                        <Card.Body>
                            <small className="fw-bold">{name}</small>
                        </Card.Body>
                    </Card>
                </Col>
            })

    return <Row className="w-100 mt-5">
        {elements}
    </Row>
}

export const Themes = () => {
    const {clientMain:client} = ClientObj()
    const {result,loading,error,runQuery} = ExecuteQueryHook(client)

    const navigate = useNavigate()
    const onNodeClick = (theme) =>{
        navigate(`/themes/${theme}`)
    }
    useEffect(() => {
        if(client){
            let q = getThemesQuery()
            runQuery(q)
        }
    }, [client]) 


    if(loading) return <span>
        Loading Themes ...
        <ProgressBar variant="info" animated now={100}/>
    </span>

    if(error) return <Alert variant={"danger"}>
        {error}
    </Alert>

    return <React.Fragment>
            <h5 className="fw-bold text-muted mt-3 mb-3">
                Browse through Themes
            </h5>
            {result && <ThemeProvider themes={result} onNodeClick={onNodeClick}/>}
        </React.Fragment>

}