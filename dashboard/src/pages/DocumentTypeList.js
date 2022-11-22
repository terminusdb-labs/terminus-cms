import TerminusClient from "@terminusdb/terminusdb-client"
import React, {useState,useEffect, Fragment} from "react";
import {Row,Col,Card, Button} from "react-bootstrap"
import {useParams, useNavigate, useSearchParams} from "react-router-dom";
import {WOQLTable,ControlledGraphqlQuery} from '@terminusdb/terminusdb-react-table'
import {graphqlQuery,tableConfigObj, advFiltersFields} from "../utils/graphqlQuery"
import ProgressBar from 'react-bootstrap/ProgressBar'
import Stack from 'react-bootstrap/Stack'
import {HiPlusSm} from "react-icons/hi"
import {CREATE_PATH} from "../components/constants"
import { AdvancedSearch } from "../components/AdvancedSearch";
import Accordion from 'react-bootstrap/Accordion'
import { DocumentsResultTable } from "../components/DocumentsResultTable";

export const DocumentTypeList = () => {   
    const {type} = useParams()
    const [searchParams]  = useSearchParams()
    let startFilters = {}
    if(searchParams.get('filters')){
        startFilters ={"name":{"regex":searchParams.get('filters')}}
    }   
    
    const navigate = useNavigate()
    const onRowClick = (row) =>{
        const fullId = row.original["id"]
        const id = fullId.substring(fullId.indexOf(type))
        navigate(`/documents/${id}`)
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
                            <Button className="bg-light text-dark" onClick={handleCreate}>
                                <HiPlusSm className="mr-1 mb-1"/>
                                <small>{`Add new ${type}`}</small>
                            </Button>
                        </div>
                </Stack>   
            </Card.Header>
            <Card.Body className="text-break">
              <DocumentsResultTable  type={type} startFilters={startFilters} onRowClick={onRowClick}/>
            </Card.Body>
        </Card>
    </div>          
}