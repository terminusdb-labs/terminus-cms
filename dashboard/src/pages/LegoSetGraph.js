import React, {useEffect} from "react";
//import {useNavigate} from "react-router-dom"
import {Container,ProgressBar} from "react-bootstrap"
import {ClientObjWeb} from "../cms-init-client-web"
import "allotment/dist/style.css";
import {WOQLGraph} from "@terminusdb-live/tdb-react-components"
import TerminusClient from '@terminusdb/terminusdb-client'
import {ExecuteQueryHook} from "../hooks/ExecuteQuery"
import {getLegoSetGraphQuery} from "../hooks/queries"
import { formatDataSet } from "../components/formatDataSet";
import {useParams} from "react-router-dom"

export const LegoSetGraph = () => {
    const {clientMain:client} = ClientObjWeb()
    //theme is the theme's name
    const {legoset} = useParams()
    const {result,loading,error,runQuery} = ExecuteQueryHook(client)

   // const {nodesObj,linkEdges} = result

    useEffect(() => { 
        if(client && legoset) {
            let query = getLegoSetGraphQuery(legoset)
            console.log(query.prettyPrint())
            runQuery(query,formatDataSet,{legoset:legoset})
        }
    }, [client,legoset])

   
    let viewer
    let nodes
    if(result){       
        nodes = Object.values(result.nodesObj)
        const woqlGraphConfig= TerminusClient.View.graph();
        woqlGraphConfig.height(1000).width(2000)
        woqlGraphConfig.literals(false);
        woqlGraphConfig.show_force(true)
            //return an WOQLGraph class
        viewer = woqlGraphConfig.create(null);
        
            // I do not set the result but the nodes and edges
        viewer.nodes = nodes
        viewer.edges = result.linkEdges
    }
    //}

    //manageClasses(classes)
    const onNodeClick = () =>{
        alert("hello")
    }

    if(loading) {
        return <Container>
                <span>
                    Loading Themes ...
                    <ProgressBar variant="info" animated now={100}/>
                </span>
                </Container>
    }

    if(error) {
        return <Container>
                return <Alert variant={"danger"}>{error}</Alert>
                </Container>
    }

    return <Container fluid>
            {result && nodes && result.linkEdges &&<WOQLGraph
                config={viewer.config}
                onClick ={onNodeClick}
                dataProvider={viewer}/>}
            </Container>      
}

