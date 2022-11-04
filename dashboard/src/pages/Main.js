import React from 'react'
import {Container,Stack,Button} from "react-bootstrap"
import {useNavigate} from "react-router-dom";

export const Main = () => {

    const navigate = useNavigate()
    const onRowClick = (id) =>{
        navigate(`/${id}`)
    }

    return <Container fluid className="p-0 flex-row h-100" bg="dark" >
        <Container>
            <Stack direction="horizontal" className="justify-content-center" style={{width: "100%", marginTop:"200px"}}>
            
                <img src="https://assets.terminusdb.com/images/terminusx-color.png" className="logo-img mr-2" width="80px"/>
                <h2>TERMINUSCMS</h2>  
            </Stack>
            <Stack direction="horizontal" gap={5} style={{width: "100%"}} className="mt-5 justify-content-center">
                    <Button onClick={()=>{onRowClick("web")}} class="mt-2" style={{width:"40%", height:"100px", background:"#66c2a5"}}><h3>Website</h3></Button>
                    <Button onClick={()=>{onRowClick("documents")}} class="mt-2" style={{width:"40%", height:"100px", background:"#8da0cb"}}><h3>Back Office</h3></Button>
            </Stack>
            
        </Container>   
    </Container>

}
