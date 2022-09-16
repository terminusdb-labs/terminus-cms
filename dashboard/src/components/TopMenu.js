import React from 'react'
import {Container, Navbar, Nav, NavDropdown , Form, Button} from "react-bootstrap"
import {SearchComponent} from "./SearchComponent"
import {NavLink as RouterNavLink} from "react-router-dom"

export const TopMenu = () => {
    const isHome = window.location.pathname === '/' ? {opacity:0} : null
    
   
    return <Navbar bg="dark" expand="lg" variant='dark'>
      <Container fluid>
        <Navbar.Brand as={RouterNavLink} to="/">TERMINUSDB CMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link as={RouterNavLink} to="documents">DOCUMENTS</Nav.Link>         
            <Nav.Link href="#" disabled>
              LINK
            </Nav.Link>         
          </Nav>
          <SearchComponent applyStyle={isHome}></SearchComponent>
          <Nav className='me-auto'>
          <Nav.Link href="#" disabled>
              Admin - Admin 
            </Nav.Link>  
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
}


