import React from "react";
import { Card, Container } from "react-bootstrap";

export function PageNotFound() {
    return (
    <Container>

        <div className="text-center" style={{marginTop:"20%"}}> 
            <h2 className="mb-5"><span><img src="https://assets.terminusdb.com/images/terminusx-color.png" 
            className="logo-img mr-2" width="60px"/>TERMINUSCMS</span>      		
            </h2>
            <h2>404 Page not found</h2>
        
      </div>
      </Container>
    );
  }