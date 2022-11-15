//import { PlusIcon, ToolbarMenu } from "@graphiql/react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import React, { useState } from "react";
import {Container} from "react-bootstrap"
import { TopMenu } from "../components/TopMenu";


//import "graphiql/graphiql.css";
//import "./style.css"

export function GraphIqlEditor() {
  const fetcher = createGraphiQLFetcher({
          url:"http://localhost:6363/api/graphql/terminuscms/lego",
          headers: {
            authorization: "Basic Y29sbGFib3JhdG9yOmRlbW9fcGFzc3dvcmQ="
        }
  });

  return (
    <Container fluid className="h-100">
      <TopMenu/>
      <GraphiQL
        editorTheme="shadowfox"
        fetcher={fetcher}
      />
    </Container>
  );
}
