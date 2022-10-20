import { NextFunction, Request, Response } from "express"

export const addContextMiddle = function (req:Request, res:Response, next:NextFunction) {

    if(!req.headers.authorization){
      return res.status(401).send("Unauthorized")
    }
    try{
      const auth : string = req.headers.authorization
      const base64Url = auth.split('Basic')[1]
      const basicDecode = atob(base64Url)
      const basicArr = basicDecode.split(':')
      req.context = {authUser : basicArr[0], authPass : basicArr[1]}
      //to be review
    }catch(err:any){
      console.log(err.message)
      return res.status(401).send("Unauthorized")
    }
    next()
}
