import React from 'react'
import {Container,Navbar} from "react-bootstrap"
import {TopMenu} from '../components/TopMenu'
import {SearchComponent} from '../components/SearchComponent'
import {Themes} from "../components/ThemeComponent"
import {ClientObjWeb} from "../cms-init-client-web"

export const Home = () => {
    const {client} = ClientObjWeb()

    return <Container fluid className="p-0 flex-row h-100" bg="dark" >
        <TopMenu showSearchBar={false}/>
        <Container>
            <Navbar variant='dark'>
                <SearchComponent applyStyle={{margin:"auto", marginTop:"400px"}}/></Navbar>    
               {client && <Themes client={client}/> }
        </Container>   
    </Container>

}
