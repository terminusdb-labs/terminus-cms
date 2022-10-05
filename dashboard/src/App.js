import React from "react";
import {Home} from "./pages/Home"
import {Documents} from "./pages/Documents"
import {Routes,Route,useNavigate} from "react-router-dom"
import { DocumentTypeList } from "./pages/DocumentTypeList";
import {DocumentInteface} from "./pages/DocumentInterface"
import {Layout} from "./pages/Layout"
import "./App.css"
//import "./Colors.css"
import { ChangeRequests } from "./pages/ChangeRequests";
import {ChangeDiff} from "./pages/ChangeDiff";


export function App (props){
    const test = async () =>{
        await count(1000,alert(1000))
    } 

    return <React.Fragment>
        <Routes>
            <Route index element={<Home/>} />
            <Route path="change_requests" >
                <Route index element={<ChangeRequests/>} />    
                <Route path=":id" element={<ChangeDiff/>} /> 
            </Route>
            
            <Route path="documents" element={<Layout />} >
                <Route index element={<Documents/>} />                     
                <Route path=":type"  >
                    <Route index element={<DocumentTypeList/>} /> 
                    <Route path=":id" element={<DocumentInteface/>} /> 
                </Route>              
            </Route>
        </Routes>
    </React.Fragment>  

}