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
import {LayoutWebPage} from "./pages/LayoutWebPage"
import {Main} from "./pages/Main"
import {ClientObj} from "./cms-init-client"
import { Alert,Container } from "react-bootstrap";
import {GraphIqlEditor} from './pages/GraphIqlEditor'
import {VIEW_LIST} from "./components/constants"
import {Themes} from "./components/ThemeComponent"
import {PageNotFound} from "./pages/PageNotFound"
import {LegoSetDescription} from "./pages/LegoSetDescription"
import {AdvancedSearch} from "./components/AdvancedSearch"
import { DocumentsResultTable } from "./components/DocumentsResultTable";
import { ApolloProvider} from '@apollo/client';
import {createApolloClient} from './utils/ApolloClientConfig'

export function App (props){
    const {error,loadingServer} = ClientObj()
    
    if(error) {
        return <Container className="h-100">
                    <Alert variant="dark" className="mt-5"><h3 className="m-5 text-center">{error}</h3></Alert>
                </Container>;
    }

    const client = createApolloClient()

    //home is the back office home page
    return <React.Fragment>
        <Routes>
            <Route index element={<Main/>} />          
            <Route path="graphiql" element={<GraphIqlEditor/>} /> 
           
            <Route path="change_requests" >
                <Route index element={<ChangeRequests/>} />    
                <Route path=":id" element={<ChangeDiff/>} /> 
            </Route>
            
            <Route path="documents" element={<Layout/>} >
                <Route index element={<Documents/>} />                     
                <Route path=":type"  >
                    <Route index element={<ApolloProvider client={client}> <DocumentTypeList/></ApolloProvider>} /> 
                    <Route path=":id" element={<ApolloProvider client={client}> <DocumentInterface/></ApolloProvider>} /> 
                </Route>              
            </Route>
        </Routes>
    </React.Fragment> 
}
