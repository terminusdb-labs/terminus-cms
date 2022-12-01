import React from 'react'
import {Container, Navbar, Nav,Button} from "react-bootstrap"
import {NavLink as RouterNavLink, useNavigate} from "react-router-dom"
import {Logo} from "./Logo"
import {BiArrowBack} from "react-icons/bi"
import { SearchComponent } from './SearchComponent'

export const TopMenuWeb = () => {

	const navigate=useNavigate()
	function goBackLegoSet() {
        navigate(-1)
    }

	const showback = window.location.pathname.endsWith("/themes") ? false : true

	return  <Navbar sticky="top" variant='light' className="m-0 p-0 mt-2">
		<Container >
			<Navbar.Brand as={RouterNavLink} to="/">
				<Logo width="40px" size="h3" className="mr-2"/>
			</Navbar.Brand>
		
			<Navbar.Toggle aria-controls="navbarScroll" />		
				<Nav
					className="me-auto my-2 my-lg-0"
					style={{ maxHeight: '100px' }}
					navbarScroll
				>
				<Nav.Link as={RouterNavLink} to="/themes" className='text-light'>Home</Nav.Link>                
				</Nav>
				<Nav className='ml-auto mr-3'>	
				<SearchComponent addClassName={false} startFilter={"LegoSet"} pagePath ={"/legoset"} nolist={true} applyStyle={{margin:"auto", marginTop:"400px"}}/>					
				</Nav>
				{showback && <Button className="ml-5 mr-4 btn-sm bg-light text-dark fw-bold" onClick={goBackLegoSet}>
					<BiArrowBack className="mr-2"/>
						Go Back
					</Button>
				}
			
		</Container>
	</Navbar>
}


