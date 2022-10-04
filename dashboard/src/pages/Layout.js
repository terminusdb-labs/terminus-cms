import React, {useState,useEffect} from "react";
import {Outlet } from "react-router-dom";
import {Container, Nav,Row,Col,Card,Alert,Button, Badge} from "react-bootstrap"
//import {useNavigate} from "react-router-dom"
import {NavLink as RouterNavLink} from "react-router-dom"
import {TopMenu} from '../components/TopMenu'
import {Allotment} from 'allotment'
import "allotment/dist/style.css";
import {ClientObj}  from "../cms-init-client"
import { SubmitChangeRequestModal } from "../components/SubmitChangeRequestModal";
import { useNavigate } from "react-router-dom";

export function Layout (props){
    const {classes,currentBranch,client,   updateBranch} = ClientObj()
    if(!client) return ''
    const [showModal,setShowModal] = useState(false)

    const getNavDropdown = () =>{
        return classes.map(item=>{
            if(item["@subdocument"]) return ""
            return <Nav.Link className ="navbar-dark navbar-nav ml-4" as={RouterNavLink} to={`/documents/${item['@id']}`} key={`item__${item['@id']}`}>
                        {item['@id']}
                   </Nav.Link>
        })
    }//#424242
    const navigate = useNavigate()

    const goToDiffPage = () =>{
        updateBranch("main")
        navigate("/")
    }


    return <Container fluid className="p-0 flex-row container-background h-100" >
                {showModal && <SubmitChangeRequestModal showModal={showModal} setShowModal={setShowModal} updateParent={goToDiffPage}/>}
                <Allotment vertical className='h-100'>
                    <Allotment.Pane maxSize={48} minSize={48}  className="bg-grey">
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
                               {currentBranch !== "main" &&
                                <Alert variant="black" className="m-5 border d-flex"> 
                                    <span>You are in the change request mode
                                        <Badge className="ml-2">{currentBranch}</Badge></span>
                                    <Button className="ml-auto" onClick={()=>{setShowModal(true)}}>Submit you change request for revision</Button>   
                                </Alert>
                                }                        
                                <Outlet/>    
                            </Allotment.Pane>
                        </Allotment>
                </Allotment.Pane>
                </Allotment>
            </Container>
}


