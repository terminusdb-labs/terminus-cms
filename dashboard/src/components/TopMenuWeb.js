import React from 'react'
import {Container, Navbar, Nav ,Dropdown, Form, Button} from "react-bootstrap"
import {SearchComponent} from "./SearchComponent"
import {NavLink as RouterNavLink} from "react-router-dom"
import {ClientObj} from "../cms-init-client"
import {AiOutlinePoweroff} from "react-icons/ai"
import logo from '../assets/terminusx-color-white.png';

export const TopMenuWeb = ({showSearchBar=true}) => {
		const {client} = ClientObj()
		const isHome = window.location.pathname === '/' ? {opacity:0} : null
		
		/*function logoutLocalUser (evt) {
				localStorage.removeItem("TerminusCMS-USER") 
				localStorage.removeItem("TerminusCMS-KEY")
				const base = "/"
				window.location.replace(`${base}`) 
		}*/
	 
		return <Navbar sticky="top" variant='light' className="m-0 p-0">
			<Container fluid>
      			<Navbar.Brand as={RouterNavLink} to="/">
					<span><img src={logo} className="logo-img mr-2 ml-5" width="25px"/>
					<label className="website-color fw-bold">TerminusCMS</label></span>
				</Navbar.Brand>
			</Container>
		</Navbar>
}


