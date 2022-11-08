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
import { ChartTest } from "./pages/ChartTest";

export function App (props){
    
    return <React.Fragment>
        <Routes>
            <Route index element={<Home/>} />
            <Route path="test" element={<ChartTest/>} />
            <Route path="change_requests">
                <Route index element={<ChangeRequests/>} />    
                <Route path=":id" element={<ChangeDiff/>} /> 
            </Route>
            
            <Route path="documents" element={<Layout/>} >
                <Route index element={<Documents/>} />                     
                <Route path=":type"  >
                    <Route index element={<DocumentTypeList/>} /> 
                    <Route path=":id" element={<DocumentInterface/>} /> 
                </Route>              
            </Route>
        </Routes>
    </React.Fragment> 

}