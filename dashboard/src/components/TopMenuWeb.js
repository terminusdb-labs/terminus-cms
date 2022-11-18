import React from 'react'
import {Container, Navbar, Nav ,Dropdown, Form, Button} from "react-bootstrap"
import {SearchComponent} from "./SearchComponent"
import {NavLink as RouterNavLink} from "react-router-dom"
import {ClientObj} from "../cms-init-client"
import {AiOutlinePoweroff} from "react-icons/ai"
import logo from '../assets/terminusx-color-white.png';

export const TopMenuWeb = () => {
		
		return  <Navbar style={{height:"80px", background:"#855afc"}} sticky="top" expand="lg" variant='light' className="m-0 p-0 ">

			<Container fluid className="">
      			<Navbar.Brand as={RouterNavLink} to="/">
				  <img src={logo} className="logo-img mr-2" width="60px"/>
				  <span style={{color:"white"}}>TerminusCMS</span></Navbar.Brand>
       		
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav
						className="me-auto my-2 my-lg-0"
						style={{ maxHeight: '100px' }}
						navbarScroll
					>
					<Nav.Link as={RouterNavLink} to="/themes">Themes</Nav.Link>                
					</Nav>
					<Nav className='ml-auto'>						
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
}


