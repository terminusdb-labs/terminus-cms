import React, {useState, useEffect} from "react"
import {Row, Col} from "react-bootstrap"
import {useParams, useNavigate} from "react-router-dom"
import {GetDocumentByNameForWebsiteHook} from "../hooks/DocumentHook"
import {ClientObj} from "../cms-init-client"
import Card from 'react-bootstrap/Card'

const Image = ({data}) => {
    if(!data.hasOwnProperty("image_url")) return <>No Image to show ...</>

    return <Card.Img variant="end" 
        style={{borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px"}} 
        src={data["image_url"]} />
}

const Details = ({data}) => {
    return <div className="mt-5">
        <h4>{data.name}</h4>
        <h6>{data.description}</h6>
    </div>
}

export const LegoSetDescription = () => {  
    
    const {client} = ClientObj()
    const {legoset} = useParams()
    const [data, setData] = useState(false)

    const doc_result = GetDocumentByNameForWebsiteHook(client, legoset, "LegoSet", setData) 

    let result={
        "@id": "LegoSet/0042ce33085eef3e9a9c2f57423ffba1da63e67f0bc435388a52aa0fb70962c2",
        "@type": "LegoSet",
        "description": "\n\n\nName\n1-Up Mushroom\n\n\nReleased\n2021\n\n\nInventory\n19 parts\n\n\nTheme\nSuper Mario\n\n\n",
        "image_url": "https://cdn.rebrickable.com/media/thumbs/sets/71394-1/90591.jpg/1000x800p.jpg",
        "inventory_set": [
          {
            "@id": "LegoSet/0042ce33085eef3e9a9c2f57423ffba1da63e67f0bc435388a52aa0fb70962c2/inventory_set/InventorySet/8601b482bdbbb8da0422916fb4ca78bc80621b57aeac8bcf4cb751b9239a9430",
            "@type": "InventorySet",
            "inventory": "Inventory/9d2bfc496de9ec5aa9d1d9332a9fb281b0ccc924c49b1925c61368219b278f54",
            "quantity": 1
          }
        ],
        "name": "1-Up Mushroom",
        "theme": "Theme/690+Super%20Mario",
        "year": "2021"
    }

    return <Card className="w-100 mt-5 mb-5 bg-secondary">
        <Row className="w-100">
            <Col md={8}>
                <Image data={result}/>
            </Col> 
            <Col md={4}>
                <Details data={result}/>
            </Col>
        </Row>
    </Card>

}