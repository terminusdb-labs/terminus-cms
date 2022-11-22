import React from 'react'
import {Container,Navbar} from "react-bootstrap"
import {TopMenuWeb} from '../components/TopMenuWeb'
import { Outlet } from 'react-router-dom'
import { SearchComponent } from '../components/SearchComponent'
import {useParams } from "react-router-dom";

export const LayoutWebPage = () => {
    
    return <Container fluid className="p-0 flex-row h-100">
            <TopMenuWeb/>
                <Container className="p-0 flex-row h-100" bg="dark" >
                    <Navbar variant='dark'>
                        <SearchComponent startFilter={""} pagePath ={"/legoset"} nolist={true} applyStyle={{margin:"auto", marginTop:"400px"}}/></Navbar>  
                    <Outlet/>
                </Container>
            </Container>

}