import * as dotenv from 'dotenv'
import express from "express";
import path  from "path";
import  cookieParser from "cookie-parser";
import logger from "morgan";
import  { initialize } from "express-openapi";
import swaggerUi from "swagger-ui-express";
import ApiDocs from "./api/api-doc.json"
import bodyParser from "body-parser";
import cors from "cors";

var app = express();

// the path is for the builded javascript version
dotenv.config({ path: __dirname+'/../.env' });

const user = process.env.USER_NAME
const key = process.env.USER_KEY
const team = process.env.TEAM_NAME

app.listen(3035);
//app.use(logger("dev"));
app.use(cors())
app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());

// OpenAPI routes
initialize({
  app,
  apiDoc: ApiDocs,//"./api/api-doc.json",//require("./api/api-doc"),
  paths: path.resolve(__dirname, 'api/paths')
});

// OpenAPI UI
app.use(
  "/api-documentation",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "http://localhost:3035/api-docs",
    },
  })
);

console.log("App running on port http://localhost:3035");
console.log(
  "OpenAPI documentation available in http://localhost:3035/api-documentation"
);

//module.exports = app;