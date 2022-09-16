import React from "react";
import {Container, Navbar, Nav, NavDropdown , Form, Button} from "react-bootstrap"
import {ClientObj}  from "../cms-init-client"

export const SearchComponent = ({applyStyle}) => {
    const {classes} = ClientObj()


    const goToDocPage = (docName) =>{


    }

    const getNavDropdown = () =>{
        return classes.map(item=>{
            return <NavDropdown.Item onClick={()=>goToDocPage(item['@id'])} key={`item__${item['@id']}`}>
                        {item['@id']}
                    </NavDropdown.Item>
        })
    }
    //tobe review
    const mystyle = applyStyle ? {style:applyStyle} : {}

    return <Nav className='me-auto' {...mystyle}>
          <NavDropdown title="All" id="navbarScrollingDropdown">
              {getNavDropdown()}
            </NavDropdown>         
          <Form className="d-flex" style={{width:"500px"}}>        
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
          </Nav>
}


