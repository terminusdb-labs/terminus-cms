
import React, {useEffect} from "react"
import {ClientObj} from "../cms-init-client"
import {ExecuteQueryHook} from "../hooks/ExecuteQuery"
import {getLegoSetByTheme} from "../hooks/queries"
import Card from 'react-bootstrap/Card'
import {Row, Col, ProgressBar, Alert, Button,Container} from 'react-bootstrap'
import {BiArrowBack} from "react-icons/bi"
import Stack from 'react-bootstrap/Stack'
import {useParams,useNavigate} from "react-router-dom"
import * as d3 from 'd3'
import {BrowseObj} from "../hooks/BrowseContext"

export const LegoSetForTheme = (props)=>{
    const {client} = ClientObj()
    //theme is the theme's name
    const {theme} = useParams()
    const {result,loading,error,runQuery} = ExecuteQueryHook(client)

  
    const navigate = useNavigate()
    const onNodeClick = (legoset) =>{
        navigate(`/themes/${theme}/${legoset}`)
    }

    useEffect(() => { 
        if(client && theme) {
            let query = getLegoSetByTheme(`${theme}`)
            runQuery(query)
        }
    }, [client,theme])

    function goBackThemes() {
        navigate(`/themes/`)
    }


    if(error) return <Alert variant={"danger"}>
        {error}
    </Alert>

    return  <Container>
       <Stack direction="horizontal" gap={3} style={{width: "98%"}} className="mt-5">
            <h5 className="fw-bold text-muted mt-3 mb-3">
                Browse through Lego Sets
            </h5>
            <Button className="btn-sm bg-light text-dark fw-bold ms-auto" onClick={goBackThemes}>
                <BiArrowBack className="mr-2"/>
                Go Back to Themes
            </Button>
        </Stack>
        {loading && <span>Loading Lego Sets ... 
        <ProgressBar variant="info" animated now={100}/></span>}
        {Array.isArray(result) && <LegoSetProvider legoSets={result} onNodeClick={onNodeClick}/>}
    </Container>
}

const LegoSetProvider = ({legoSets,onNodeClick}) => {
    
    const color = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]);
    
    const {theme} = useParams()
    const navigate=useNavigate()

    const legoSetTmp ={}

    const elements= legoSets.map((set,index) => {
        if(legoSetTmp[set.LegoSet]) return ''
        legoSetTmp[set.LegoSet] = true
        let isActive = {}
        if(set.InventoryPart) {
            isActive= {style:{"borderColor": color(set["Name"]["@value"]), "borderWidth": "4px"}, onClick:()=>{onNodeClick(set["Name"]["@value"])} } 
        }

        const onNodeClick = (legoSet) =>{
            navigate(`/themes/${theme}/${legoSet}`)
        }

        return  <Col md={2} className="mb-5" key={`legoset__${index}`}>
                <Card className="lego__set__card theme__card"  {...isActive}
                    onClick={(e) => onNodeClick(set["Name"]["@value"])} 
                    id={set["Name"]["@value"]}>
                    <div className="lego__set__image__div"></div>
                    <Card.Body>
                        <small className="fw-bold">{set["Name"]["@value"]}</small>
                    </Card.Body>
                </Card>
            </Col>
    })

    return <Row className="w-100 mt-5">
        {elements}
    </Row>
}