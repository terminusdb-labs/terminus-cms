import TerminusClient from "@terminusdb/terminusdb-client"
import React,{useState,useEffect} from "react";
import { WOQLTable, ControlledGraphqlQuery } from '@terminusdb/terminusdb-react-table'
import { graphqlQuery, tableConfigObj, advFiltersFields } from "../utils/graphqlQuery"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { AdvancedSearch } from "../components/AdvancedSearch";
import Accordion from 'react-bootstrap/Accordion'
import {Tab,Tabs,Form, Button} from 'react-bootstrap'
import { GraphqlQueryView } from "./GraphqlQueryViewer";

export const DocumentsResultTable = ({type,onRowClick,showGraphqlTab=true}) => {
    const query = graphqlQuery[type]
    const [advSearchFields,setAdvFields] = useState(false)
    const [queryToDisplay,setQueryTodisplay] = useState(false)
   
    if (!query) return ""
    const { documentError,
        rowCount,
        changeOrder,
        changeLimits,
        changeFilters,
        setAdvancedFilters,
        limit,
        queryFilters,
        start,
        orderBy,
        filterBy,
        loading,
        documentResults } = ControlledGraphqlQuery(query, type, 10, 0, {}, false);
    
    useEffect(() => {
       if(type){
            setQueryTodisplay(query.loc.source.body)
            setAdvFields(advFiltersFields[type])          
       }
    },[type]);

    const onRowClickCall = (row) => {
        if (onRowClick) {
            const rowTmp = row && row.original ? {label:row.original.name, id:row.original._id}: {}
            onRowClick(rowTmp)
        }
    }
    // let advSearchFields = advFiltersFields[type] || false
    const tableConfig = typeof tableConfigObj[type] === "function" ? tableConfigObj[type]() : TerminusClient.View.table()
    tableConfig.row().click(onRowClickCall)

    let extractedResults = documentResults ? extractDocuments(documentResults[type]) : []

    function extractDocuments(documentResults) {
        var extractedResults = []

        documentResults.map(item => {
            var newJson = {}
            for (var key in item) {
                // if it is an array this is set type, I can have more than 1 result for row
                //?? I can pust the count
                if (Array.isArray(item[key])) {
                    newJson[key] = `${(item[key].length)}`
                }
                else if (item[key] && typeof item[key] === "object") {
                    //key 
                    const objectKey = Object.keys(item[key])
                    objectKey.forEach(element => {
                        newJson[`${key}--${element}`] = item[key][element]
                    });
                }
                else {
                    newJson[key] = item[key]
                }
            }
            extractedResults.push(newJson)
        })
        //console.log("extractedResults", extractedResults)
        return extractedResults
    }



   // const showBar = loading ? {className:"visible"} : {className:"invisible"}
    return <div>          
            {advSearchFields &&
                 <Accordion className="mb-4">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Advanced filter</Accordion.Header>
                        <Accordion.Body>
                           <AdvancedSearch fields={advSearchFields} setFilter={setAdvancedFilters} />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            }
            {loading && <span >
                Loading {type} ...
                <ProgressBar variant="success" animated now={100}  className="mb-4"/>
            </span>}
            {!loading && 
            <Tabs defaultActiveKey="table" className="mb-3" >
                <Tab eventKey="table" title="Result Table">
                    {!loading && Array.isArray(extractedResults) && 
                    <WOQLTable 
                        result={extractedResults}
                        freewidth={true}
                        view={(tableConfig ? tableConfig.json() : {})}
                        limit={limit}
                        start={start}
                        orderBy={orderBy}
                        filtersBy={filterBy}
                        setFilters={changeFilters}
                        setLimits={changeLimits}
                        setOrder={changeOrder}
                    // resultColumns={getColumnsFromResults(extractedResults)}
                        query={false}
                        loading={loading}
                        totalRows={rowCount}
                />}
            </Tab>
           {showGraphqlTab && <Tab eventKey="graphql" title="Graphql Query">
                <div>
                {queryToDisplay && 
                   <GraphqlQueryView 
                     filterBy={queryFilters}
                     orderBy={orderBy}
                     start={start}
                     limit={limit}
                     queryToDisplay={queryToDisplay} />
                }
                </div>
            </Tab>}
         </Tabs>}
    </div>
}