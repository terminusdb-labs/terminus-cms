import TerminusClient from "@terminusdb/terminusdb-client"
import React,{useState,useEffect,useRef} from "react";
import { WOQLTable, ControlledGraphqlQuery } from '@terminusdb/terminusdb-react-table'
import { graphqlQuery, tableConfigObj, advFiltersFields } from "../utils/graphqlQuery"
import {FiCopy} from "react-icons/fi"
import {MODEL_BUILDER_EDITOR_OPTIONS} from "../utils/appUtils"
import ProgressBar from 'react-bootstrap/ProgressBar'
import { AdvancedSearch } from "../components/AdvancedSearch";
import Accordion from 'react-bootstrap/Accordion'
import {Tab,Tabs,Form, Button} from 'react-bootstrap'
import 'codemirror/theme/ayu-dark.css'
//import {UnControlled as CodeMirror} from 'react-codemirror2'
//import 'codemirror/lib/codemirror.css'
//import 'codemirror/theme/ayu-dark.css'
//require('codemirror/mode/css/css')
//require('codemirror/mode/javascript/javascript')
//import 'codemirror/addon/display/autorefresh.js'

import CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror-graphql/hint';
import 'codemirror-graphql/lint';
import 'codemirror-graphql/mode';

export const GraphqlQueryView = ({queryToDisplay,variablesObj}) => {
    
    const textInput = useRef(null);
    const variables = useRef(null);

    let textInputEditor
    let variablesEditor


    useEffect(() => {
        if(textInput && textInput.current){
            textInputEditor = CodeMirror.fromTextArea(textInput.current, {
                mode: 'graphql',
                height: "auto",
                readOnly:true,
                theme:"shadowfox",
                refresh:true,
                autoRefresh: true,
              });     
        }
        if(variables && variables.current){
            variablesEditor = CodeMirror.fromTextArea(variables.current, {
                mode: 'json',
                height: "auto",
                theme:"shadowfox",
                autoRefresh: true,
                refresh:true,
                readOnly:true
              });     
        }
     },[textInput.current,variables.current]);


     const copyTest = (editor)=>{
        navigator.clipboard.writeText(editor.getValue());
    }

   return <React.Fragment>
            <div className="d-flex justify-content-end mr-2">
                <Button title = "copy grapl query" onClick={()=>{copyTest(textInputEditor)}}><FiCopy/></Button>
            </div>              
            <textarea key="textInput" id="textInput" ref={textInput} value={queryToDisplay}></textarea>                       
            
            <hr></hr>
            <div className="d-flex justify-content-end mr-2">
                <Button title ="copy variables"  onClick={()=>{copyTest(variablesEditor)}}><FiCopy/></Button>
            </div>  
            <textarea  key="variables" id="variables" ref={variables} value={JSON.stringify(variablesObj,null,4)}></textarea>
        </React.Fragment>
}