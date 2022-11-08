import React, { useState } from "react";
import {Home} from "./pages/Home"
import {Documents} from "./pages/Documents"
import {Routes,Route, useNavigate} from "react-router-dom"
import { DocumentTypeList } from "./pages/DocumentTypeList";
import {DocumentInterface} from "./pages/DocumentInterface"
import {Layout} from "./pages/Layout"
import "./App.css"
//import "./Colors.css"
import { ChangeRequests } from "./pages/ChangeRequests";
import {ChangeDiff} from "./pages/ChangeDiff";
import { LegoSetGraph } from "./pages/LegoSetGraph";
import { LegoSetForTheme } from "./pages/LegoSetForTheme";
import {LayoutNoMenu} from "./pages/LayoutNoMenu"
import {Main} from "./pages/Main"
import {ClientObj} from "./cms-init-client"
import { Alert,Container } from "react-bootstrap";
import {GraphIqlEditor} from './pages/GraphIqlEditor'
import {VIEW_LIST} from "./components/constants"
// <Route index element={<Home/>} /> 
export function App (props){
    const {error,loadingServer} = ClientObj()
    const [currentMode, setCurrentMode] = useState(VIEW_LIST)

    if(error) {
        return <Container className="h-100">
                    <Alert variant="dark" className="mt-5"><h3 className="m-5 text-center">{error}</h3></Alert>
                </Container>;
    }

    return <React.Fragment>
        <Routes>
            <Route index element={<Main/>} /> 
            <Route path="web" element={<Home/>} /> 
            <Route path="graphiql" element={<GraphIqlEditor/>} /> 
           
            <Route path="change_requests" >
                <Route index element={<ChangeRequests/>} />    
                <Route path=":id" element={<ChangeDiff/>} /> 
            </Route>
            
            <Route path="documents" element={<Layout setCurrentMode={setCurrentMode}/>} >
                <Route index element={<Documents/>} />                     
                <Route path=":type"  >
                    <Route index element={<DocumentTypeList setCurrentMode={setCurrentMode} currentMode={currentMode}/>} /> 
                    <Route path=":id" element={<DocumentInterface setCurrentMode={setCurrentMode} currentMode={currentMode}/>} /> 
                </Route>              
            </Route>
            <Route path="theme" element={<LayoutNoMenu/>}>
                <Route path=":theme" >
                    <Route index element={<LegoSetForTheme/>} /> 
                    <Route path=":legoset" element={<LegoSetGraph/>} />   
                </Route>
            </Route>
            
        </Routes>
    </React.Fragment> 

}