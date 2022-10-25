import React from 'react'
import {Container,Navbar} from "react-bootstrap"
import {TopMenu} from '../components/TopMenu'
import {SearchComponent} from '../components/SearchComponent'
import {BrowseContextProvider} from '../hooks/BrowseContext'
import {Themes} from "../components/ThemeComponent"

export const Home = () => {
    return <Container fluid className="p-0 flex-row h-100" bg="dark" >
        <TopMenu showSearchBar={false}/>
        <Container>
            <Navbar variant='dark'><SearchComponent applyStyle={{margin:"auto", marginTop:"400px"}}/></Navbar>    
            <BrowseContextProvider>
                <Themes/> 
            </BrowseContextProvider>
        </Container>   
    </Container>

}
