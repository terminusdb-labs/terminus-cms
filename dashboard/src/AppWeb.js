import React, { useState } from "react";
import {Routes,Route} from "react-router-dom"
import "./App.css"
import { LegoSetGraph } from "./pages/LegoSetGraph";
import { LegoSetForTheme } from "./pages/LegoSetForTheme";
import {LayoutWebPage} from "./pages/LayoutWebPage"
import {Main} from "./pages/Main"
import { Alert,Container } from "react-bootstrap";
import {VIEW_LIST} from "./components/constants"
import {Themes} from "./components/ThemeComponent"
import {PageNotFound} from "./pages/PageNotFound"
import {LegoSetDescription} from "./pages/LegoSetDescription"
import {ClientObjWeb} from "./cms-init-client-web"

export function AppWeb (props){
    const {error,loadingServer} = ClientObjWeb()
    if(error) {
        return <Container className="h-100">
                    <Alert variant="dark" className="mt-5"><h3 className="m-5 text-center">{error}</h3></Alert>
                </Container>;
    }

    return <React.Fragment>
        <Routes>
            <Route index element={<Main/>} />          
            <Route path="themes" element={<LayoutWebPage/>}>
                <Route index element={<Themes/>} /> 
                <Route path=":theme" >
                    <Route index element={<LegoSetForTheme/>} />                     
                </Route>
            </Route>
            {/* this is after the serch result*/}
            <Route path="legoset" element={<LayoutWebPage/>}>
                <Route index element={<LegoSetForTheme/>} />
                <Route path=":legoset" element={<LegoSetDescription/>} /> 
                <Route path=":legoset/graph" element={<LegoSetGraph/>} /> 
            </Route>
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    </React.Fragment> 

}

/*
 <Route path="graphiql" element={<GraphIqlEditor/>} /> 
           
            <Route path="change_requests" >
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
           */

// <Route path="home" element={<Home/>} /> 