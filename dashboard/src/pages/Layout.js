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
import { useNavigate, useParams } from "react-router-dom"
import {BiGitBranch} from "react-icons/bi"
import {VscGitPullRequestDraft} from "react-icons/vsc"

export function Layout (){
    const [showModal,setShowModal] = useState(false)
    const {classes,currentBranch,client,updateBranch} = ClientObj()
    const navigate = useNavigate()
    if(!client) return ''
    const getNavDropdown = () =>{ 
        return classes.map(item=>{ 
            if(item["@subdocument"]) return ""
            return <Nav.Link className ="navbar-dark navbar-nav ml-4" 
                as={RouterNavLink} to={`/documents/${item['@id']}`} 
                key={`item__${item['@id']}`}>
                {item['@id']}
            </Nav.Link> 
        })
    }//#424242

    const updateParent = () =>{
        updateBranch("main" , null)
        navigate("/change_requests")
    }

    return <Container fluid className="p-0 flex-row container-background h-100" >
                {showModal && <SubmitChangeRequestModal showModal={showModal} setShowModal={setShowModal} updateParent={updateParent}/>}
                <Allotment vertical className='h-100'>
                    <Allotment.Pane maxSize={48} minSize={48}  className="bg-grey overflow-visible" >
                    <TopMenu/>
                    </Allotment.Pane>
                    <Allotment.Pane >
                        <Allotment horizontal>
                            <Allotment.Pane  maxSize={250} minSize={250} snap>                         
                                <Nav className="flex-column mt-5">
                                    {getNavDropdown()}
                                </Nav> 
                            </Allotment.Pane>
                            <Allotment.Pane>
                            <div className="h-100 overflow-auto">
                               {currentBranch && currentBranch !== "main" &&
                                <Alert variant="secondary" className="m-5 d-flex"> 
                                    <span>
                                        <small className="fw-bold mr-2">You are in change request mode</small>
                                        <BiGitBranch className="text-muted mr-2"/>
                                        <Badge bg="success" className="fw-bold mr-2">{currentBranch}</Badge>
                                    </span>
                                    <Button className="ml-auto bg-light text-dark btn-sm" onClick={()=>{setShowModal(true)}}>
                                        <small className="fw-bold">Submit your change request for revision</small>
                                    </Button>   
                                </Alert>
                                }                        
                                <Outlet/>   
                            </div> 
                            </Allotment.Pane>
                        </Allotment>
                </Allotment.Pane>
                </Allotment>
            </Container>
}


