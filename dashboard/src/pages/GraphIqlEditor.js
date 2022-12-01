//import { PlusIcon, ToolbarMenu } from "@graphiql/react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import React, { useState } from "react";
import {Container} from "react-bootstrap"
import { TopMenu } from "../components/TopMenu";


//import "graphiql/graphiql.css";
//import "./style.css"

export function GraphIqlEditor() {
  const branchName =  localStorage.getItem("TERMINUSCMS_BRANCH")
  const user = localStorage.getItem("TerminusCMS-USER") 
  const key = localStorage.getItem("TerminusCMS-KEY")

  const basicAuth = btoa(`${user}:${key}`)
  const url = branchName ? `http://localhost:6363/api/graphql/terminuscms/lego/local/branch/${branchName}` : "http://localhost:6363/api/graphql/terminuscms/lego" 

  const fetcher = createGraphiQLFetcher({
          url:url,
          headers: {
            authorization: 'Basic '+ basicAuth
        }
  });

  return (
    <Container fluid className="h-100">
      <TopMenu showSearchBar={false} showBranch={true}/>
      <GraphiQL
        editorTheme="shadowfox"
        fetcher={fetcher}
      />
    </Container>
  );
}
