import React, {useState,useEffect} from "react";
import {Outlet } from "react-router-dom";
import {Container, Nav,Row,Col,Card} from "react-bootstrap"
//import {useNavigate} from "react-router-dom"
import {NavLink as RouterNavLink} from "react-router-dom"
import {TopMenu} from '../components/TopMenu'
import {Allotment} from 'allotment'
import "allotment/dist/style.css";
import {ClientObj}  from "../cms-init-client"

export function Layout (props){
    const {classes} = ClientObj()
    
    const getNavDropdown = () =>{
        return classes.map(item=>{
            if(item["@subdocument"]) return ""
            return <Nav.Link as={RouterNavLink} to={`/documents/${item['@id']}`} key={`item__${item['@id']}`}>
                        {item['@id']}
                   </Nav.Link>
        })
    }

    return <Container fluid className="p-0 flex-row container-background h-100" >
                <Allotment vertical className='h-100'>
                    <Allotment.Pane maxSize={48} minSize={48}>
                    <TopMenu/>
                    </Allotment.Pane>
                    <Allotment.Pane >
                        <Allotment horizontal>
                            <Allotment.Pane  maxSize={250} minSize={250} snap>                         
                            <Nav className="flex-column">
                                {getNavDropdown()}
                            </Nav> 
                            </Allotment.Pane>
                            <Allotment.Pane>                          
                                <Outlet/>    
                            </Allotment.Pane>
                        </Allotment>
                </Allotment.Pane>
                </Allotment>
            </Container>
}


