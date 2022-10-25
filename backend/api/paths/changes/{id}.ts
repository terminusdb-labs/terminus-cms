import { Operation } from "express-openapi";
import { Request,Response, } from "express";
import ChangeRequestDB from "../../core/ChangeRequestDB";

    export const parameters = [
      {
        in: 'path',
        name: 'id',
        required: true,
        type: 'integer'
      }
    ];

    export const GET: Operation = async(req:Request, res:Response) =>{
      try{
          const crId = req.params.id
          const changeR = new ChangeRequestDB(req)
          const result = await changeR.getChangeRequests(crId)
          res.status(200).json();
      }catch(err:any){
          console.log(err.message)
          const status = err.status || 500
          const errData = err.data  || {message: "I can not get the change requests list"}
          res.status(status).send(errData);
      }
    }
  
    export const PUT: Operation = async(req:Request, res:Response)=>{
      try{
        const crId = req.params.id
        const changeR = new ChangeRequestDB(req)
        await changeR.changeRequestStatus(crId,req.body.status,req.body.message)
        res.status(200).send({message:"The change request status has been update"});
      }catch(err:any){
         console.log(err.message)
         const status = err.status || 500
         const errData = err.data  || {message: "I can not update the change request status"}
         res.status(status).send(errData);
      }
    }
  
    export const DELETE: Operation =(req:Request, res:Response) => {
      console.log(`About to delete Change Request id: ${req.query.id}`);
      res.status(200).send();
    }
  
    GET.apiDoc = {
      summary: "Fetch Change requests.",
      operationId: "getChangeRequest",
      responses: {
        200: {
          description: "List of change requests.",
          schema: {
            type: "object",
            items: {
              $ref: "#/definitions/ChangeRequestObj",
            },
          },
        },
      },
    };
  
    PUT.apiDoc = {
      summary: "Update Change Request.",
      operationId: "updateChangeRequest",
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          type: "string"
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
          in: "path",
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