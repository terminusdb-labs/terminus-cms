import React from 'react'
import {Container, Navbar, Nav ,Dropdown, Form, Button} from "react-bootstrap"
import {SearchComponent} from "./SearchComponent"
import {NavLink as RouterNavLink, useParams} from "react-router-dom"
import {ClientObj} from "../cms-init-client"
import {AiOutlinePoweroff} from "react-icons/ai"
import {Logo} from "./Logo"

export const TopMenu = ({showSearchBar=true}) => {
		const {client,classes} = ClientObj()
		const {type} = useParams()
		const isHome = window.location.pathname === '/' ? {opacity:0} : null
		
		function logoutLocalUser (evt) {
			localStorage.clear()
			const base = "/documents"
			window.location.replace(`${base}`) 
		}
	 
		return <Navbar sticky="top" expand="lg" variant='dark' className="m-0 p-2 bg-grey">
			<Container fluid className="">
      			<Navbar.Brand as={RouterNavLink} to="/">
				  	<Logo width="35px" size="h4" filter="logo-img"/>	
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav
						className="me-auto my-2 my-lg-0"
						style={{ maxHeight: '100px' }}
						navbarScroll
					>
						<Nav.Link as={RouterNavLink} to="/documents">Documents</Nav.Link>         
						<Nav.Link as={RouterNavLink} to="/change_requests">Change requests</Nav.Link> 
						<Nav.Link as={RouterNavLink} to="/graphiql">GraphiQL</Nav.Link>          
					</Nav>
					{showSearchBar && <SearchComponent classes ={classes} applyStyle={isHome} startFilter={type}></SearchComponent>}
					<Nav className='ml-auto'>
						<Dropdown className="mr-4" id="profile_menu">
							<Button size="sm" className="bg-transparent border-0">
								{client && client.user() || "Log-out"}
							</Button>
							<Dropdown.Toggle split className="bg-transparent border-0" id="profile_menu_arrow">
							</Dropdown.Toggle>
							<Dropdown.Menu >
									<Dropdown.Item onClick={logoutLocalUser} >
											<AiOutlinePoweroff className="mr-3 mb-1" />
											Logout
									</Dropdown.Item>
							</Dropdown.Menu>
					</Dropdown> 
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
}


