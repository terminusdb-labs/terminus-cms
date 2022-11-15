import React from "react";
//import {useNavigate} from "react-router-dom"
import { Link , useNavigate} from "react-router-dom";
import {ClientObj}  from "../cms-init-client"
import "allotment/dist/style.css";
import {WOQLGraph} from "@terminusdb-live/tdb-react-components"
import TerminusClient from '@terminusdb/terminusdb-client'
import * as d3 from 'd3'

export const Documents = () => {
    const {classes} = ClientObj()

    const navigate = useNavigate()
    const onNodeClick = (id) =>{
        navigate(`/documents/${id}`) 
    }

    const classObj = {}
    const linkPropertyFromTo = {}
    const linkPropertyToFrom = {}
    const noProperty = {"@id":true,"@key":true,"@subdocument":true,"@type":true}
    const isSub = {}
    const nodeClassesObject = {}
    let nodeClasses = []
    const linkEdges = []
    let viewer

    const color = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]);

    const manageClasses =(classes) =>{
        if(!Array.isArray(classes)) return 
        
        classes.forEach((item,index)=>{
            classObj[item['@id']] = item
            const radius = Math.ceil((30 * index)/3)+20
            nodeClassesObject [item['@id']] = {
                "collisionRadius" : 90,
                "type": "node",
                "subdocument" : "",
                "id": item['@id'],
                "icon" : {label:true},
                "nodetype": item['@id'],
                "color": color(radius),//[255, 178, 102],
                "text": item['@id'],
                "toptext" : radius,
                "radius": radius//Math.ceil((30 * index)/3)+20
            }
        })
        nodeClasses = Object.values(nodeClassesObject)

        function calculateOffset(target){
            if(nodeClassesObject[target]){
                return nodeClassesObject[target].radius +3
            }
        }

        classes.forEach((item)=>{
            const classId= item["@id"]
            Object.keys(item).forEach(key=>{
                if(!noProperty[key]){
                    let propValue =  typeof item[key] === "object" ? item[key]["@class"] : item[key] 
                    if(classObj[propValue]){
                        if(typeof linkPropertyFromTo[classId] !== "object"){
                            linkPropertyFromTo[classId] = {}
                        } 
                        //maybe is better an array ??
                        linkPropertyFromTo[classId][key] = propValue
                        linkEdges.push ({
                            "type": "link",
                            "target": propValue,
                            "source": classId,
                            "text": key,
                            "size": 2,
                            "icon": {
                                "label": true,
                                "color": [
                                    109,
                                    98,
                                    100
                                ],
                                "size": 1
                            },
                            "arrow": {
                                "width": 50,
                                "height": 20,
                                "offset" : calculateOffset(propValue)
                            }
                        })
                        if(typeof linkPropertyToFrom[propValue] !== "object"){
                            linkPropertyToFrom[propValue] = {}
                        }
                        //propValue is the class name 
                        //no complete secure of this
                        linkPropertyToFrom[propValue][key] = classId
                    }
                }
            })
        })

       
        const woqlGraphConfig= TerminusClient.View.graph();
        woqlGraphConfig.height(1000).width(1500)
        woqlGraphConfig.literals(false);
        woqlGraphConfig.show_force(true)
        //return an WOQLGraph class
        viewer = woqlGraphConfig.create(null);
    
        // I do not set the result but the nodes and edges
        viewer.nodes = nodeClasses
        viewer.edges = linkEdges

    }

    manageClasses(classes)
 
    return  <div> 
        <div>
            {nodeClasses.length>0 && linkEdges.length>0 &&<WOQLGraph
                config={viewer.config}
                onClick ={onNodeClick}
                dataProvider={viewer}/>}
        </div>
    </div>               
}

