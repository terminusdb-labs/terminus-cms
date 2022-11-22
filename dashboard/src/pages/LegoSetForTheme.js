
import React, {useEffect} from "react"
import {ClientObj} from "../cms-init-client"
import Card from 'react-bootstrap/Card'
import {Row, Col, ProgressBar, Alert, Button,Container} from 'react-bootstrap'
import Stack from 'react-bootstrap/Stack'
import {useParams,useNavigate,useSearchParams} from "react-router-dom"
import * as d3 from 'd3'
import {ControlledGraphqlQuery} from '@terminusdb/terminusdb-react-table'
import {legoSetWeb} from "../utils/graphqlQuery"

export const LegoSetForTheme = (props)=>{
    
    const {theme} = useParams()
    const [searchParams]  = useSearchParams()
    let startFilters = {}
    if(searchParams.get('filters')){
        startFilters ={"name":{"regex":`(?i)${searchParams.get('filters')}`}}
    }else if(theme){
        startFilters ={"theme":{"name":{"eq":theme}}}
    }

    const query = legoSetWeb

    const { error,loading,
        documentResults} = ControlledGraphqlQuery(query, "LegoSet", 50,0,{},startFilters);
   
    const result = documentResults &&  documentResults.LegoSet ? documentResults.LegoSet : []
  
    const navigate = useNavigate()
    const onNodeClick = (legoset) =>{
       // navigate(`/themes/${theme}/${legoset}`)

        navigate(`/legoset/${legoset}`)
    }

    /*useEffect(() => { 
        if(client && theme) {
            let query = getLegoSetByTheme(`${theme}`)
            runQuery(query)
        }
    }, [client,theme])*/

    if(error) return <Alert variant={"danger"}>
        {error}
    </Alert>

    return  <Container>
       <Stack direction="horizontal" gap={3} style={{width: "98%"}} className="mt-5">
            <h5 className="fw-bold text-muted mt-3 mb-3">
                Browse through Lego Sets
            </h5>
        </Stack>
        {loading && <span>Loading Lego Sets ... 
        <ProgressBar variant="info" animated now={100}/></span>}
        {Array.isArray(result) && <LegoSetProvider legoSets={result} onNodeClick={onNodeClick}/>}
    </Container>
}

const LegoSetProvider = ({legoSets,onNodeClick}) => {
    
    const color = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]);
    
    //const legoSetTmp ={}

    console.log(legoSets)

    const elements= legoSets.map((set,index) => {
        //if(legoSetTmp[set.LegoSet]) return ''
        //legoSetTmp[set.LegoSet] = true
        let isActive = {}
        if(set.inventory_set.lenght>0 && 
           set.inventory_set[0].inventory.inventory_parts.lenght>0) {
            isActive= {style:{"borderColor": color(set.name), "borderWidth": "4px"}, onClick:()=>{onNodeClick(set.name)} } 
        }

        const onNodeClickCall = (legoSet) =>{
            if(onNodeClick)onNodeClick(legoSet)
        }

        return  <Col md={2} className="mb-5" key={`legoset__${index}`}>
                <Card className="lego__set__card theme__card"  {...isActive}
                    onClick={(e) => onNodeClickCall(set.name)} 
                    id={set.name}>
                    <div className="lego__set__image__div"></div>
                    <Card.Body>
                        <small className="fw-bold">{set.name}</small>
                    </Card.Body>
                </Card>
            </Col>
    })

    return <Row className="w-100 mt-5">
        {elements}
    </Row>
}