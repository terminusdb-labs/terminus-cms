import { PlusIcon, ToolbarMenu } from "@graphiql/react";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { GraphiQL } from "graphiql";
import React, { useState } from "react";


//import "graphiql/graphiql.css";
//import "./style.css";

const API_LIST = [
  {
    name: "swapi",
    url: "https://swapi-graphql.netlify.app/.netlify/functions/index"
  },
  {
    name: "spacex",
    url: "https://api.spacex.land/graphql"
  }
];

export function GraphIqlEditor() {
  const [{ fetcher, name }, setFetcher] = useState(() => ({
    fetcher: createGraphiQLFetcher({
      url:"http://localhost:6363/api/graphql/terminuscms/lego",
      headers: {
        authorization: "Basic Y29sbGFib3JhdG9yOmRlbW9fcGFzc3dvcmQ="
    }
    })
  }));
  return (
    <GraphiQL
      fetcher={fetcher}
      toolbar={{
        additionalContent: (
          <ToolbarMenu
            button={<PlusIcon className="graphiql-toolbar-icon" />}
            label={name}
          >
            {API_LIST.map(({ name, url }) => (
              <ToolbarMenu.Item
                onSelect={() =>
                  setFetcher({ fetcher: createGraphiQLFetcher({ url }), name })
                }
              >
                {name}
              </ToolbarMenu.Item>
            ))}
          </ToolbarMenu>
        )
      }}
    />
  );
}
