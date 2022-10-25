import { Operation } from "express-openapi";
import { Request,Response, } from "express";
import ChangeRequestDB from "../../../../core/ChangeRequestDB";
import * as typeDef from "../../../../core/typeDef"

    export const GET: Operation = async(req:Request, res:Response) =>{
      try{
          const crId = req.params.id
          const changeR = new ChangeRequestDB(req)
          const result = await changeR.getChangeRequestDiff(crId)
          res.status(200).json(result);
      }catch(err:any){
          console.log(err.message)
          const status = err.status || 500
          const errData = err.data  || {message: "I can not get the change requests diff documents"}
          res.status(status).send(errData);
      }
    }
  
   /* export const POST: Operation = async (req:Request, res:Response) =>{
      try{
        const timestamp = Date.now()
        const message = req.body.message || "create a new change request"
        const payload : typeDef.ChangeReqDoc ={
          "@type" : "ChangeRequest",
          "origin_database" : "lego",
          "status" :  "Open" ,
          "tracking_branch" : req.body.tracking_branch,
          "original_branch" : req.body.original_branch,
          "creator" : req.body.author, 
          "creation_time" : Date.now(),
          "messages" :[{"@type": "Message", "timestamp":timestamp,
                        "text":message,"author":req.body.author}]
        }
        const changeR = new ChangeRequestDB(req)
        const crId= await changeR.createChangeRequest(payload,message)
        console.log(`About to create Change Request: ${JSON.stringify(req.body)}`);
        res.status(201).send({message:"the change request as been created",...crId});
      }catch(err:any){
          console.log(err.message)
          const status = err.status || 500
          const errData = err.data  || {message: "I can not create a new change Request"}
          res.status(status).send(errData);
      }
    }*/
    
    GET.apiDoc = {
      summary: "to view all the changes between the main branch and the given change request ",
      operationId: "getChangeRequestsDiff",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          type: "string"
        },
      ],
      responses: {
        200: {
          description: "List of document diff.",
          schema: {
            type: "array",
            items:{
              "type": "object"
            }
          },
        },
      },
    };
  
    /*POST.apiDoc = {
      summary: "Create Change Request.",
      operationId: "createChangeRequest",
      consumes: ["application/json"],
      parameters: [
        {
          in: "body",
          name: "change request",
          schema: {
            $ref: "#/definitions/PostChangeRequest",
          },
        },
      ],
      responses: {
        201: {
          description: "Created",
        },
      },
    };*/

    //return operations;
 // };

  //export default operation