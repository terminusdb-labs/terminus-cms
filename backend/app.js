import express from "express";
import path  from "path";
import  cookieParser from "cookie-parser";
import logger from "morgan";
import  { initialize } from "express-openapi";
import swaggerUi from "swagger-ui-express";

var app = express();

app.listen(3035);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// OpenAPI routes
initialize({
  app,
  apiDoc: "./api/api-doc.json",//require("./api/api-doc"),
  paths: "./api/paths",
});

// OpenAPI UI
app.use(
  "/api-documentation",
  swaggerUi.serve,
  swaggerUi.setup(null, {
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