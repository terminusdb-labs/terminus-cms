import React from "react";
import {Home} from "./pages/Home"
import {Documents} from "./pages/Documents"
import {Routes,Route,useNavigate} from "react-router-dom"
import { DocumentTypeList } from "./pages/DocumentTypeList";

export function App (props){
    return <React.Fragment>
            <Routes>
                <Route index element={<Home/>} />
                <Route path="documents" >
                    <Route index element={<Documents/>} />                     
                    <Route path=":type" element={<DocumentTypeList/>} >
                        <Route path=":id" element={<Home/>} /> 
                    </Route>              
                </Route>
            </Routes>
          </React.Fragment>  

}