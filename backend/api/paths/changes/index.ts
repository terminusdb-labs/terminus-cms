import { Operation } from "express-openapi";
import { Request,Response, } from "express";
import ChangeRequestDB from "../../core/ChangeRequestDB";
import * as typeDef from "../../core/typeDef"

    export const GET: Operation = async(req:Request, res:Response) =>{
      try{
          const changeR = new ChangeRequestDB(req)
          const result = changeR.getChangeRequests()
          res.status(200).json(result);
      }catch(err:any){
          console.log(err.message)
          const status = err.status || 500
          const errData = err.data  || {message: "I can not get the change requests list"}
          res.status(status).send(errData);
      }
    }
  
    export const POST: Operation = async (req:Request, res:Response) =>{
      try{
        const timestamp = Date.now()
        const message = req.body.message || "create a new change request"
        const payload : typeDef.ChangeReqDoc ={
          "@type" : "ChangeRequest",
          "origin_database" : "lego",
          "status" :  "Open" ,
          "tracking_branch" : req.body.tracking_branch,
          "original_branch" : req.body.original_branch,
          "author" : req.body.author, 
          "creation_time" : Date.now(),
          "messages" :[{"@type": "Message", "timestamp":timestamp,
                        "text":message}]
        }
        const changeR = new ChangeRequestDB(req)
        await changeR.createChangeRequest(payload,message)
        console.log(`About to create Change Request: ${JSON.stringify(req.body)}`);
        res.status(201).send("the change request as been created");
      }catch(err:any){
          console.log(err.message)
          const status = err.status || 500
          const errData = err.data  || {message: "I can not create a new change Request"}
          res.status(status).send(errData);
      }
    }
  
    export const PUT: Operation =(req:Request, res:Response)=>{
      console.log(`About to update Change Request status: ${req.query.status}`);
      res.status(200).send();
    }
  
    export const DELETE: Operation =(req:Request, res:Response) => {
      console.log(`About to delete Change Request id: ${req.query.id}`);
      res.status(200).send();
    }
  
    GET.apiDoc = {
      summary: "Fetch Change requests.",
      operationId: "getChangeRequests",
      responses: {
        200: {
          description: "List of change requests.",
          schema: {
            type: "array",
            items: {
              $ref: "#/definitions/ChangeRequest",
            },
          },
        },
      },
    };
  
    POST.apiDoc = {
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
    };
  
    PUT.apiDoc = {
      summary: "Update Change Request.",
      operationId: "updateChangeRequest",
      parameters: [
        {
          in: "query",
          name: "status",
          required: true,
          type: "string",
        },
        {
          in: "body",
          name: "change request",
          schema: {
            $ref: "#/definitions/PutChangeRequest",
          },
        },
      ],
      responses: {
        200: {
          description: "Updated ok",
        },
      },
    };
  
    DELETE.apiDoc = {
      summary: "Delete Change Request.",
      operationId: "deleteChangeRequest",
      consumes: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "id",
          required: true,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "Delete",
        },
      },
    };
  
    //return operations;
 // };

  //export default operation