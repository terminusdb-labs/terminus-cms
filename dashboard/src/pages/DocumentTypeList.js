import React from "react";
import {Allotment} from 'allotment'
import {Container, Nav} from "react-bootstrap"
//import {useNavigate} from "react-router-dom"
import {TopMenu} from '../components/TopMenu'
import { Link,useParams } from "react-router-dom";
import {ClientObj}  from "../cms-init-client"
import "allotment/dist/style.css";

export const DocumentTypeList = () => {
    const {type} = useParams()

    const {classes} = ClientObj()
   /* let navigate = useNavigate();
    function handleClick(docName) {
        navigate(`/documents/`+docName)
        
        //setDataProduct(dp.name)         
    }*/

    const getNavDropdown = () =>{
        return classes.map(item=>{
            return <Link to={`/documents/${item['@id']}`} key={`item__${item['@id']}`}>
                        {item['@id']}
                   </Link>
        })
    }



    return <Container fluid className="p-0 flex-row h-100" bg="dark" >
                <Allotment vertical className='h-100'>
                    <Allotment.Pane 
                        maxSize={48}
                        minSize={48}>
                    <TopMenu/>
                    </Allotment.Pane>
                    <Allotment.Pane >
                        <Allotment horizontal>
                            <Allotment.Pane  maxSize={280} snap
                            minSize={280}>
                           
                            <Nav className="flex-column">
                                {getNavDropdown()}
                            </Nav> 
                            </Allotment.Pane>
                            <Allotment.Pane>                          
                                  <h1>  {`${type} DOCUMENTS PAGE`}   </h1>               
                            </Allotment.Pane>
                        </Allotment>
                </Allotment.Pane>
                </Allotment>
            </Container>


}