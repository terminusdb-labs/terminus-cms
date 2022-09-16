import React from 'react'
import {Container,Navbar} from "react-bootstrap"
import { Allotment } from 'allotment'
import {TopMenu} from '../components/TopMenu'
import { SearchComponent } from '../components/SearchComponent'

export const Home = () => {
    return <Container fluid className="p-0 flex-row h-100" bg="dark" >
                    <Allotment vertical className='h-100'>
                    <Allotment.Pane 
                        maxSize={48}
                        minSize={48}
                        >
                       <TopMenu/>
                    </Allotment.Pane>
                    <Allotment.Pane >
                        <div className='h-100' style={{background:"black"}}>

                        <Navbar variant='dark'><SearchComponent applyStyle={{margin:"auto", marginTop:"400px"}}/></Navbar>
                        </div>
                    </Allotment.Pane>
                    </Allotment>
            </Container>

}
