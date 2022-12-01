import React from 'react'
import {Container,Stack,Button} from "react-bootstrap"
import {useNavigate} from "react-router-dom"
import {Logo} from "../components/Logo"
import {ActionButton} from "../components/ActionButton"

export const Main = () => {

    //const navigate = useNavigate()
    const onRowClick = (id) =>{
        //navigate(`/${id}`)
        location.replace(`/${id}`)
    }
 
    return <Container fluid className="p-0 flex-row h-100" bg="dark" >
        <Container>
            <Stack direction="horizontal" 
                className="justify-content-center"
                style={{width: "100%", marginTop:"200px"}}>
                <Logo width="55px" size="h1"/>
            </Stack>
            <Stack direction="horizontal" 
                gap={5} 
                style={{width: "100%"}} 
                className="mt-5 justify-content-center">
                    <ActionButton bgColor={"#66c2a5"} 
                        label={"Website"} 
                        handleClick={()=>{onRowClick("themes")}}/>
                    <ActionButton bgColor={"#8da0cb"} 
                        label={"Back Office"} 
                        handleClick={()=>{onRowClick("documents")}}/>
            </Stack>
        </Container>   
    </Container>

}
