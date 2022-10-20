declare namespace Express {
   export interface Request {
      context: {authPass:string ,authUser:string}
   }
}