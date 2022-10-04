import { Operation } from "express-openapi";
import { Request,Response, } from "express";
import ChangeRequestDB from "../../core/ChangeRequestDB";
import * as typeDef from "../../core/typeDef"

    export const GET: Operation = async(req:Request, res:Response) =>{
      try{
         // const changeR = new ChangeRequestDB(req)
         // const result = changeR.getChangeRequests()
          res.status(200).json("ok");
      }catch(err:any){
          //console.log(err.message)
          //const status = err.status || 500
          // const errData = err.data  || {message: "I can not get the change requests list"}
          res.status(500).send("error");
      }
    }
  

    GET.apiDoc = {
      summary: "Get the documents diff between 2 branches",
      operationId: "getDocumentsDiff",
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
          "description": "Document Diff Result",
          "schema": {
            "$ref": "#/definitions/GetDiff",
          }
        }
      }
    };
