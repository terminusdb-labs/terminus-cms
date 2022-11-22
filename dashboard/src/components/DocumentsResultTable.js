import TerminusClient from "@terminusdb/terminusdb-client"
import React, { useState, useEffect, Fragment } from "react";
import { Row, Col, Card, Button } from "react-bootstrap"
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { WOQLTable, ControlledGraphqlQuery } from '@terminusdb/terminusdb-react-table'
import { graphqlQuery, tableConfigObj, advFiltersFields } from "../utils/graphqlQuery"
import ProgressBar from 'react-bootstrap/ProgressBar'
import Stack from 'react-bootstrap/Stack'
import { HiPlusSm } from "react-icons/hi"
import { CREATE_PATH } from "../components/constants"
import { AdvancedSearch } from "../components/AdvancedSearch";
import Accordion from 'react-bootstrap/Accordion'

export const DocumentsResultTable = ({type}) => {
    const query = graphqlQuery[type]
    if (!query) return ""

    const advSearchFields = advFiltersFields[type] || false
    const tableConfig = typeof tableConfigObj[type] === "function" ? tableConfigObj[type]() : new 
    tableConfig.row().click(onRowClickCall)

    const { documentError,
        rowCount,
        changeOrder,
        changeLimits,
        changeFilters,
        setAdvancedFilters,
        limit,
        start,
        orderBy,
        filterBy,
        loading,
        documentResults } = ControlledGraphqlQuery(query, type, 10, 0, {}, false);

    // let extractedResults = documentResults ? documentResults[type] : [] 

   // const rowCount = 300
    // const [extractedResults, setExtractedResults]=useState(null)
    // const [tableConfig, setTableConfig] = useState(false)
    // const [advSearchFields,setAdvSearchFields] = useState(null)

    const getColumnsFromResults = (results) => {
        let columns = []
        for (var k in results[0]) {
            if (k !== "id")
                columns.push(k)
        }
        //columns[columns.length] = "Delete"
        //columns[columns.length] = "Copy"
        // add delete and copy button for document explorer
        return columns
    }

    const onRowClickCall = (row) => {
        if (onRowClick) onRowClick(row)
    }
    let extractedResults = documentResults ? extractDocuments(documentResults[type]) : []

    /*useEffect(() => { // set table view config
        if(!documentResults) return
       // setBarLoading(false)
        let extractedResults = documentResults ? extractDocuments(documentResults[type]) : [] 
        setExtractedResults(extractedResults)
    }, [documentResults])*/

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
            {!loading && Array.isArray(extractedResults) && <WOQLTable 
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
    </div>
}