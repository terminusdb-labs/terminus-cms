import React,{useState} from "react";
import {NavDropdown , Form, InputGroup,Dropdown,Button} from "react-bootstrap"
import {ClientObj}  from "../cms-init-client"
import {noProperty} from "../utils/constants"
export const SearchComponent = ({applyStyle,startFilter}) => {
    const {classes} = ClientObj()

    const filter = startFilter || "LegoSet"
    const [inputSearch, setInputSearch]=useState(`${filter}:`)
    const [selectedClass, setSelectedClass]=useState(filter)
    const placeholder  = "Search"

    function handleOnChange(e) {
      e.preventDefault()
      let searchText = e.target.value
      setInputSearch(searchText)
      //onChange(searchText)
  }

   function changeFilterFrom (value){
         setSelectedClass(value)
         setInputSearch(`${value}: `)
   }
  
    const getNavDropdown = () =>{
        return classes.map((item , index)=>{
            return <React.Fragment key={`element__${item['@id']}`} >
                <NavDropdown.Item eventKey={item['@id']} key={`item__${item['@id']}`}>
                      {item['@id']}
                </NavDropdown.Item>
                {index!== (classes.length-1) && <Dropdown.Divider key={`divided__${item['@id']}`} />}
                </React.Fragment>
        })
    }
    //tobe review
    const mystyle = applyStyle ? {style:applyStyle} : {}

    const startSearch = ()=>{
        
    }

    return <React.Fragment>
          <Form className="navbar-search mr-3 mt-1 ml-auto mr-auto">
          <Form.Group id="topbarSearch">
          
              <InputGroup className="input-group-merge search-bar">
                  <InputGroup.Text style={{border: "1px solid #adb5bd"}}>
                  <NavDropdown title={"Filters"} id="navbarScrollingDropdown" onSelect={changeFilterFrom}>
                    {getNavDropdown()}
                  </NavDropdown>

                  </InputGroup.Text>
                  <Form.Control onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                        // Do code here
                        ev.preventDefault();
                        startSearch(inputSearch)
                    }
                    }} type="text"  value={inputSearch} className="bg-transparent search-input" onChange={handleOnChange}/>
              </InputGroup>
          </Form.Group>
          </Form>
          </React.Fragment>
    



}


