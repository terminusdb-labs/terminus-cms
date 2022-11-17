import React, {useState, useEffect} from "react"
import {Row, Container, Button} from "react-bootstrap"
import {useParams, useNavigate} from "react-router-dom"
import {GetDocumentByNameForWebsiteHook} from "../hooks/DocumentHook"
import {ClientObj} from "../cms-init-client"
import Card from 'react-bootstrap/Card'
import {BsFillCartCheckFill, BsStarHalf} from "react-icons/bs"
import {BiArrowBack} from "react-icons/bi"
import {AiOutlineCheck, AiFillStar, AiOutlineHeart} from "react-icons/ai"
import Stack from 'react-bootstrap/Stack'
import {GrNodes} from "react-icons/gr"

const Image = ({data}) => {
    if(!data.hasOwnProperty("image_url")) return <>No Image to show ...</>

    return <Card className="bg-secondary col-md-4">
        <Card.Img variant="top" 
            style={{borderTopLeftRadius: "4px", borderBottomLeftRadius: "4px"}} 
            src={data["image_url"]} />
        <Card.Body className="text-center">
            <div className="mt-4 mb-4">    
                <AiOutlineHeart className="mb-1 text-danger"/> Add to wishlist 
            </div>
            <React.Fragment>
                <div>Shop more like this</div> 
                <Button variant="outline-light" className="btn btn-sm">Fantasy</Button>{' '}
                <Button variant="outline-light" className="btn btn-sm">Minecraft®</Button>{' '}
                <Button variant="outline-light" className="btn btn-sm">Mushroom</Button>{' '}
            </React.Fragment>
        </Card.Body>
    </Card>
}


const Details= ({data}) => {

    const {legoset, theme} = useParams()
    const navigate=useNavigate()

    function handleNodeClick(e) {
        navigate(`/themes/${theme}/${legoset}/graph`)
    }

    return <Card className="bg-secondary col-md-8">
        <Card.Body>
            <Stack direction="horizontal" gap={1} className="text-warning mt-3">
                <AiFillStar/>
                <AiFillStar/>
                <AiFillStar/>
                <BsStarHalf/>
                <BsStarHalf/>
                <div className="text-muted ml-2 fw-bold">4.3 (238 reviews)</div>
                <Button className="btn btn-sm bg-light text-dark  ms-auto" 
                    title="Click to view links"
                    onClick={handleNodeClick}> 
                    <GrNodes className="mr-1"/>Links 
                </Button>
            </Stack>
            <small className="text-muted">(89%) reviewers recommend this product</small>
            <h4 className="fw-bold mt-5">{data.name}</h4>
            <Card.Text>
                {data.description}
            </Card.Text><br/>
            <h2>$350.00</h2><br/>
            <div className="d-grid gap-2">
                <Button className="btn btn-lg bg-info text-dark">
                    <BsFillCartCheckFill className="mr-3"/>Add to Bag
                </Button>
            </div><br/>
            <Stack direction="horizontal" gap={2} className="text-gray">
                <small className="fw-bold">Availability</small>
                <small className="text-success fw-bold">In Stock</small>
            </Stack> 
            <Stack direction="horizontal" gap={2} className="text-gray">
                <small className="fw-bold">Assembly Required</small>
                <small>Yes</small>
            </Stack>
            <Stack direction="horizontal" gap={2} className="text-gray">
                <small className="fw-bold">Age Suitability</small>
                <small>3 years +</small>
            </Stack>
            <hr/>
            <AiOutlineCheck className="mr-2 text-success"/> <span>Home Delivery available on this item</span>
            <hr/>
            <AiOutlineCheck className="mr-2 text-success"/> <span>Free click & collect in 2 hours</span>
        </Card.Body>
    </Card>
}

export const LegoSetDescription = () => {  
    
    const {clientMain:client} = ClientObj()
    const {legoset} = useParams()
    const [data, setData] = useState(false)

    const {theme} = useParams()
    const navigate=useNavigate()

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

    function goBackLegoSet() {
        navigate(`/themes/${theme}`)
    }

    return <Container fluid>
        <Stack direction="horizontal" gap={3} style={{width: "98%"}} className="mt-5">
            <h5 className="fw-bold mt-3 mb-3">
                <span className="text-muted ">LegoSet : </span><span className="text-gray">{result.name}</span>
            </h5>
            <Button className="btn-sm bg-light text-dark fw-bold ms-auto" onClick={goBackLegoSet}>
                <BiArrowBack className="mr-2"/>
                Go Back to LegoSets
            </Button>
        </Stack>
        <Card className="w-100 mt-5 mb-5 website__card h-100">
            <Row className="w-100">
                <Image data={result}/>
                <Details data={result}/>
            </Row>
        </Card>
    </Container>
}