import React from 'react'
import {Container, Navbar, Nav ,Dropdown, Form, Button} from "react-bootstrap"
import {NavLink as RouterNavLink} from "react-router-dom"
import {ClientObj} from "../cms-init-client"
import {AiOutlinePoweroff} from "react-icons/ai"

export const TopMenuWeb = () => {
		return  <Navbar sticky="top" variant='light' className="m-0 p-0">
			<Container fluid className="">
				<Navbar.Brand as={RouterNavLink} to="/">
					<span className='h3'><img src="https://assets.terminusdb.com/images/terminusx-color.png" className="mr-2 ml-5" width="40px"/>
					<label className="website-color fw-bold">TerminusCMS</label></span>
				</Navbar.Brand>
       		
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


