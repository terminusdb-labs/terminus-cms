import React, {useEffect} from "react"
import {Row, Column} from "react-bootstrap"

export const LegoSetDescription = ({legoSetData}) => {  
   
    return <Row className="w-100 mt-5">
            <Column md={8}>
                main    
            </Column> 
            <Column>
            side
            </Column>
          </Row>
}