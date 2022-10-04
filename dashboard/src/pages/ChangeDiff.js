import React from 'react'
import {Container,Navbar} from "react-bootstrap"
import { Allotment } from 'allotment'
import {TopMenu} from '../components/TopMenu'
import { SearchComponent } from '../components/SearchComponent'
import { useParams } from 'react-router-dom'
import {GetDiffList,GetDocumentByBranches} from "../hooks/DocumentHook"
import { ClientObj } from "../cms-init-client"

export const ChangeDiff = () => {
    //id is the tracking branch name
    const { client } = ClientObj()
    if(!client) return ""
    const { id } = useParams()
    const {result} = GetDiffList(client,id) 

console.log(result)

    return <Container fluid className="p-0 flex-row h-100" bg="dark" >
                    <TopMenu showSearchBar={false}/>
                    <Container>
                       WELCOME IN DIFF PAGE 
                       {result && <div>{JSON.stringify(result)}</div>}             
                    </Container>                 
            </Container>

}
