import React,{useState} from "react";
import {NavDropdown , Form, InputGroup,Dropdown,Button} from "react-bootstrap"
import {ClientObj}  from "../cms-init-client"
import {noProperty} from "../utils/constants"
export const SearchComponent = ({applyStyle}) => {
    const {classes} = ClientObj()

    const [inputSearch, setInputSearch]=useState("")
    const [selectedClass, setSelectedClass]=useState("All")
    const placeholder  = "Search"

    function handleOnChange(e) {
      e.preventDefault()
      let searchText = e.target.value
      setInputSearch(searchText)
      //onChange(searchText)
  }
  
    const getNavDropdown = () =>{
        return classes.map((item , index)=>{
            return <React.Fragment key={`element__${item['@id']}`} ><NavDropdown.Item eventKey={item['@id']} key={`item__${item['@id']}`}>
                      {item['@id']}
                </NavDropdown.Item>
                {index!== (classes.length-1) && <Dropdown.Divider key={`divided__${item['@id']}`} />}
                </React.Fragment>
        })
    }
    //tobe review
    const mystyle = applyStyle ? {style:applyStyle} : {}

    return <React.Fragment>
          <Form className="navbar-search mr-3 mt-1 ml-auto mr-auto">
          <Form.Group id="topbarSearch">
          
              <InputGroup className="input-group-merge search-bar">
                  <InputGroup.Text style={{border: "1px solid rgb(102, 102, 102)"}}>
                  <NavDropdown title={selectedClass} id="navbarScrollingDropdown" onSelect={setSelectedClass}>
                    {getNavDropdown()}
                  </NavDropdown>

                  </InputGroup.Text>
                  <Form.Control type="text" placeholder={placeholder} value={inputSearch} className="bg-transparent search-input" onChange={handleOnChange}/>
              </InputGroup>
          </Form.Group>
          </Form>
          </React.Fragment>
    



}


