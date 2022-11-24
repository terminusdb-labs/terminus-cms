import React from 'react'
import {Container, Navbar, Nav} from "react-bootstrap"
import {NavLink as RouterNavLink} from "react-router-dom"
import {Logo} from "./Logo"

export const TopMenuWeb = () => {
	return  <Navbar sticky="top" variant='light' className="m-0 p-0">
		<Container fluid className="">
			<Navbar.Brand as={RouterNavLink} to="/">
				<Logo width="40px" size="h3"/>
			</Navbar.Brand>
		
			<Navbar.Toggle aria-controls="navbarScroll" />
			<Navbar.Collapse id="navbarScroll">
				<Nav
					className="me-auto my-2 my-lg-0"
					style={{ maxHeight: '100px' }}
					navbarScroll
				>
				<Nav.Link as={RouterNavLink} to="/themes" className='text-light'>Themes</Nav.Link>                
				</Nav>
				<Nav className='ml-auto'>						
				</Nav>
			</Navbar.Collapse>
		</Container>
	</Navbar>
}


