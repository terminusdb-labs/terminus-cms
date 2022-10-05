import React from 'react'
import {Container, Navbar, Nav, NavDropdown , Form, Button} from "react-bootstrap"
import {SearchComponent} from "./SearchComponent"
import {NavLink as RouterNavLink} from "react-router-dom"

export const TopMenu = ({showSearchBar=true}) => {
    const isHome = window.location.pathname === '/' ? {opacity:0} : null
    
   
    return <Navbar  expand="lg" variant='dark' className="m-0 p-0 bg-grey">
      <Container fluid>
        
        <Navbar.Brand as={RouterNavLink} to="/"><img src="https://assets.terminusdb.com/images/terminusx-color.png" className="logo-img mr-2" width="40px"/>TERMINUSCMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link as={RouterNavLink} to="/documents">Documents</Nav.Link>         
            <Nav.Link as={RouterNavLink} to="/change_requests">Change requests</Nav.Link>          
          </Nav>
          {showSearchBar && <SearchComponent applyStyle={isHome}></SearchComponent>}
          <Nav className='ml-auto'>
          <Nav.Link href="#" disabled>
              Admin - Admin 
            </Nav.Link>  
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
}


