import TerminusClient from "@terminusdb/terminusdb-client"
import React, {useState,useEffect} from "react";
import {Row,Col,Card, Button} from "react-bootstrap"
import {useParams,useNavigate } from "react-router-dom";
import {WOQLTable,ControlledGetDocumentQuery} from '@terminusdb/terminusdb-react-table'
import {ClientObj}  from "../cms-init-client"
import ProgressBar from 'react-bootstrap/ProgressBar'
import Stack from 'react-bootstrap/Stack'
import {HiPlusSm} from "react-icons/hi"
import {DocumentInterface} from "./DocumentInterface"
import {CREATE_PATH} from "../components/constants"

export const DocumentTypeList = ({setCurrentMode, currentMode}) => {   
    const {client} = ClientObj()
    const {type} = useParams()
    const {
        updateQuery,
        changeOrder,
        changeLimits,
        controlledDocument,
        result,
        limit,
        start,
        orderBy,
        loading,
        rowCount,
        documentResults,
        setDocumentResults,
        setControlledRefresh,
        controlledRefresh
    } = ControlledGetDocumentQuery(client, type, 10)

    const [extractedResults, setExtractedResults]=useState([])
    const [tableConfig, setTableConfig] = useState(false)

    const getColumnsFromResults = (results) => {
        let columns = []
        for(var k in results[0]) {
            if(k!=="@id" && k!=="@type")
                columns.push(k)
        }
        //columns[columns.length] = "Delete"
        //columns[columns.length] = "Copy"
        // add delete and copy button for document explorer
        return columns
    }

    useEffect(() => { // set table view config
        if(!documentResults) return
       // setBarLoading(false)
        let extractedResults = extractDocuments(documentResults) 
        setExtractedResults(extractedResults)
        let tConf = getDocumentOfTypeTabConfig(extractedResults, onRowClick)
        setTableConfig(tConf)
    }, [documentResults])

    const navigate = useNavigate()
    const onRowClick = (row) =>{
        const id = row.original["@id"]
        //setCurrentMode(actions.VIEW)
        navigate(`/documents/${id}`)
    }

    const getDocumentOfTypeTabConfig = (result, onRowClick) => {
        const tabConfig= TerminusClient.View.table()
    
    
        tabConfig.pager("remote")
        tabConfig.pagesize(10)
    
        let columns = getColumnsFromResults(result)
    
        tabConfig.column_order(...columns)
        tabConfig.row().click(onRowClick)
    
        return tabConfig
    }
 
    function extractDocuments(documentResults) {
        var extractedResults=[]
        
        documentResults.map(item=> {
            var newJson={}
            for(var key in item){
                if(Array.isArray(item[key])){
                    var type = item[key][0]["@type"]
                    if(frames[`terminusdb:///schema#${type}`] && frames[`terminusdb:///schema#${type}`]["@subdocument"]){
                        // this is a subdocument
                        var newArray=[]
                        item[key].map(thing => {
                            newArray.push(thing["@id"])
                        })
                        newJson[key]=newArray
                    }
                }
                else if(typeof item[key] === "object"){
                    if(item[key].hasOwnProperty("@id")){ // object - we do not display sys json data as part of table
                        newJson[key]=item[key]["@id"]
                    }
                }
                else {
                    newJson[key]=item[key]
                }
            }
            extractedResults.push(newJson)
        })
        //console.log("extractedResults", extractedResults)
        return extractedResults
    }

    function handleCreate(e) {
        //setCurrentMode(actions.CREATE)
        navigate(`/documents/${type}/${CREATE_PATH}`)
    }

    
    return  <div className="m-5">
        <Card className="content  w-100 mt-5" varaint="light">
            <Card.Header>
                <Stack direction="horizontal" gap={3}>
                    <h6>Documents of type - <strong className="text-success">{type}</strong></h6>
                    <div className="ms-auto">
                        <Button className="bg-light text-dark" onClick={handleCreate}>
                            <HiPlusSm className="mr-1 mb-1"/>
                            <small>{`Add new ${type}`}</small>
                        </Button>
                    </div>
                </Stack>
            </Card.Header>
            <Card.Body className="text-break">
                {extractedResults && extractedResults.length===0 && <span>
                    Loading {type}s ... 
                    <ProgressBar variant="info" animated now={100}/>
                </span>}
                {extractedResults && extractedResults.length>0 && <WOQLTable
                    result={extractedResults}
                    freewidth={true}
                    view={(tableConfig ? tableConfig.json() : {})}
                    limit={limit}
                    start={start}
                    orderBy={orderBy}
                    setLimits={changeLimits}
                    setOrder={changeOrder}
                    resultColumns={getColumnsFromResults(extractedResults)}
                    query={false} 
                    loading={loading}
                    totalRows={rowCount}
                />}
            </Card.Body>
        </Card>
    </div> 
    
}