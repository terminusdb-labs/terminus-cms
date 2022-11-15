import TerminusClient from "@terminusdb/terminusdb-client"
import React, {useState,useEffect} from "react";
import {Row,Col,Card, Button} from "react-bootstrap"
import {useParams, useNavigate, useSearchParams} from "react-router-dom";
import {WOQLTable,ControlledGraphqlQuery} from '@terminusdb/terminusdb-react-table'
import {ClientObj}  from "../cms-init-client"
import {graphqlQuery} from "../utils/graphqlQuery"
import ProgressBar from 'react-bootstrap/ProgressBar'
import {tableConfigObj} from '../utils/graphqlQuery'
import Stack from 'react-bootstrap/Stack'
import {HiPlusSm} from "react-icons/hi"
import {DocumentInterface} from "./DocumentInterface"
import {CREATE_PATH} from "../components/constants"

export const DocumentTypeList = () => {   
    const {type} = useParams()
    const [searchParams]  = useSearchParams()
    let startFilters = {}
    if(searchParams.get('filters')){
        startFilters ={"name":{"regex":searchParams.get('filters')}}
    }    
    const query = graphqlQuery[type]
    if(!query) return ""

    const { documentError,
        changeOrder,
        changeLimits,
        changeFilters,
        limit,
        start,
        orderBy,
        filterBy,
        loading,
        documentResults} = ControlledGraphqlQuery(query, type, 10,0,{},startFilters);
   

   // let extractedResults = documentResults ? documentResults[type] : [] 

    const rowCount = 300
    const [extractedResults, setExtractedResults]=useState(null)
    const [tableConfig, setTableConfig] = useState(false)

    const getColumnsFromResults = (results) => {
        let columns = []
        for(var k in results[0]) {
            if(k!=="id")
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
        let extractedResults = documentResults ? extractDocuments(documentResults[type]) : [] 
        setExtractedResults(extractedResults)
        let tConf
        if(tableConfigObj[type]){
            tConf=tableConfigObj[type]()
            tConf.row().click(onRowClick)
        }else {
            tConf = getDocumentOfTypeTabConfig(extractedResults, onRowClick)
        }
        setTableConfig(tConf)
    }, [documentResults])

    const navigate = useNavigate()
    const onRowClick = (row) =>{
        const fullId = row.original["id"]
        const id = fullId.substring(fullId.indexOf(type))
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
                // if it is an array this is set type, I can have more than 1 result for row
                //?? I can pust the count
                if(Array.isArray(item[key])){
                    newJson[key]= `${(item[key].length)}`
                }
                else if(item[key] && typeof item[key] === "object"){
                    //key 
                    const objectKey = Object.keys(item[key])
                    objectKey.forEach(element => {
                        newJson[`${key}--${element}`] =  item[key][element]  
                    });
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
        navigate(`/documents/${type}/${CREATE_PATH}`)
    }

    
    return  <div className="m-5">
        <Card className="content  w-100 mt-5" variant="light">
            <Card.Header>
                <Stack direction="horizontal" gap={3}>
                    <h6>Documents of type - <strong className="text-success">{type}</strong></h6>
                        <div className="ms-auto">
                            <Button className="bg-success text-dark" onClick={handleCreate}>
                                <HiPlusSm className="mr-1 mb-1"/>
                                <small>{`Add new ${type}`}</small>
                            </Button>
                        </div>
                </Stack>   
            </Card.Header>
            <Card.Body className="text-break">
                {loading && <span>
                    Loading {type} ... 
                    <ProgressBar variant="info" animated now={100}/>
                </span>}
                {!loading && Array.isArray(extractedResults) && <WOQLTable
                    result={extractedResults}
                    freewidth={true}
                    view={(tableConfig ? tableConfig.json() : {})}
                    limit={limit}
                    start={start}
                    orderBy={orderBy}
                    filtersBy={filterBy}
                    setFilters = {changeFilters}
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