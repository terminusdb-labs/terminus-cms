import React from "react"
import {App} from "./App"
import {AppWeb} from "./AppWeb"
import {LoginModal} from "./components/LoginModal"
import {BrowserRouter,useNavigate} from "react-router-dom"
import { createRoot } from 'react-dom/client';
import {ClientProvider} from './cms-init-client'
import {ClientProviderWeb} from './cms-init-client-web'
import {createApolloClient} from './utils/ApolloClientConfig'
import { ApolloProvider} from '@apollo/client';

function AppComponent(){
    // I need the login only in the back office
    
    var searchPattern = new RegExp('/^(\/graphiql|\/change_requests|\/documents)/');
   
    if (window.location.pathname.startsWith('/documents') ||  
        window.location.pathname.startsWith('/change_requests') || 
        window.location.pathname.startsWith('/graphiql')) {
        if(!localStorage.getItem("TerminusCMS-USER") || !localStorage.getItem("TerminusCMS-KEY")){
            return <LoginModal showModal={true} isCloseble={false}/>
        }

      //  const client = createApolloClient()
        return <ClientProvider ><App/></ClientProvider>
    }

    const client = createApolloClient()
    return <ApolloProvider client={client}><ClientProviderWeb ><AppWeb/></ClientProviderWeb></ApolloProvider>

}

//branch 

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<BrowserRouter><AppComponent/></BrowserRouter>);
