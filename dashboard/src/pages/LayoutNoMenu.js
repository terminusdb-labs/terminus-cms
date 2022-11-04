import React from 'react'
import {Container} from "react-bootstrap"
import {TopMenu} from '../components/TopMenu'
import { Outlet } from 'react-router-dom'

export const LayoutNoMenu = () => {
    return <Container fluid className="p-0 flex-row h-100" bg="dark" >
        <TopMenu showSearchBar={false}/>
            <Outlet/>
        </Container>

}