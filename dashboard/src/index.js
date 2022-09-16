import React from "react"
import {App} from "./App"
import {LoginModal} from "./components/LoginModal"
import {BrowserRouter,useNavigate} from "react-router-dom"
import { createRoot } from 'react-dom/client';
import {ClientProvider} from './cms-init-client'

function AppComponent(){

    if(!localStorage.getItem("TerminusCMS-USER") || !localStorage.getItem("TerminusCMS-KEY")){
        return <LoginModal showModal={true} isCloseble={false}/>
    }
    return <ClientProvider ><App/></ClientProvider>

}

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<BrowserRouter><AppComponent/></BrowserRouter>);
