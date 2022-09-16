import React from "react";
import {Allotment} from 'allotment'
import {Container, Nav} from "react-bootstrap"
//import {useNavigate} from "react-router-dom"
import {TopMenu} from '../components/TopMenu'
import { Link} from "react-router-dom";
import {ClientObj}  from "../cms-init-client"
import "allotment/dist/style.css";

export const Documents = () => {
    const {classes} = ClientObj()
   

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
                                   ALL THE DOCUMENTS                  
                            </Allotment.Pane>
                        </Allotment>
                </Allotment.Pane>
                </Allotment>
            </Container>

}

/*
<Allotment.Pane  maxSize={280} minSize={280}>
                            <div style={{height:1000}} className=" border border-right">
                            <Nav className="flex-column">
                                {getNavDropdown()}
                            </Nav>

                            </div>
                            
                        </Allotment.Pane>
                        <div> DOCUMENTS PAGE ALL THE DOCUMENTS</div>*/

/*
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
                                <div style={{height:1000}} className=" border border-right">
                                <Nav className="flex-column">
                                    {getNavDropdown()}
                                </Nav>

                                </div>
                                    
                                </Allotment.Pane>
                                <Allotment.Pane>
                                
                                        DOCUMENTS PAGE ALL THE DOCUMENTS
                            
                                </Allotment.Pane>
                            </Allotment>
                    </Allotment.Pane>
                    </Allotment>
            </Container>*/