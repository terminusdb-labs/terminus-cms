import React from 'react'
import {Container, Navbar, Nav ,Dropdown, Form, Button} from "react-bootstrap"
import {SearchComponent} from "./SearchComponent"
import {NavLink as RouterNavLink} from "react-router-dom"
import {ClientObj} from "../cms-init-client"
import {AiOutlinePoweroff} from "react-icons/ai"

export const TopMenuWeb = ({showSearchBar=true}) => {
		const {client} = ClientObj()
		const isHome = window.location.pathname === '/' ? {opacity:0} : null
		
		/*function logoutLocalUser (evt) {
				localStorage.removeItem("TerminusCMS-USER") 
				localStorage.removeItem("TerminusCMS-KEY")
				const base = "/"
				window.location.replace(`${base}`) 
		}*/
	 
		return <Navbar style={{height:"80px"}} sticky="top" expand="lg" variant='dark' className="m-0 p-0 bg-warning">
			<Container fluid>
      			<Navbar.Brand as={RouterNavLink} to="/">
					<span><img src="https://assets.terminusdb.com/images/terminusx-color.png" className="logo-img mr-2" width="60px"/>
					TERMINUSCMS</span>
				</Navbar.Brand>
			</Container>
		</Navbar>
}


