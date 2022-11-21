import React, {useState} from 'react';
import {Query, Builder, BasicConfig, Utils as QbUtils} from 'react-awesome-query-builder';

// For AntDesign widgets only:
//import AntdConfig from 'react-awesome-query-builder/lib/config/antd';
//import 'antd/dist/antd.css'; // or import "react-awesome-query-builder/css/antd.less";
// For MUI 4/5 widgets only:
import MaterialConfig from 'react-awesome-query-builder/lib/config/material';

//import MuiConfig from 'react-awesome-query-builder/lib/config/mui';

// For Bootstrap widgets only:
//import BootstrapConfig from "react-awesome-query-builder/lib/config/bootstrap";

import 'react-awesome-query-builder/lib/css/styles.css';


//import 'react-awesome-query-builder/lib/css/compact_styles.css'; //optional, for more compact styles

// Choose your skin (ant/material/vanilla):
const InitialConfig = MaterialConfig  //AntdConfig; // or MaterialConfig or MuiConfig or BootstrapConfig or BasicConfig

const typeMatch = {"string":"text"}

console.log("proxy operator", InitialConfig.operators.proximity)

console.log("InitialConfig.operators" , InitialConfig.operators)


const regex = {
  label: "Regex",
  labelForFormat: "Regex",
  jsonLogic: "regex",
  reversedOp: 'not_equal',
  cardinality: 1,
  formatOp: (field, _op, value, _valueSrc, _valueType, opDef) => `${field} ${opDef.labelForFormat} ${value}`,
  mongoFormatOp:null
}

console.log(InitialConfig.operators.like)
console.log(InitialConfig.operators.proximity.options)

console.log("TEXT", InitialConfig.types.text)

const types = InitialConfig.types

const textop = types.text.widgets.text.operators //
textop.push("regex")

console.log("textop",textop)
types.text.widgets.text.operators = textop//types.text.widgets.text.operators
types.text.widgets.textarea.operators = textop

const operators = {
  equal:InitialConfig.operators.equal,
  not_equal:InitialConfig.operators.not_equal,
  less:InitialConfig.operators.less,
  less_or_equal:InitialConfig.operators.less_or_equal,
  greater:InitialConfig.operators.greater,
  greater_or_equal:InitialConfig.operators.greater_or_equal,
  starts_with:InitialConfig.operators.starts_with,
  select_any_in:InitialConfig.operators.select_any_in, //Contains any of the terms in the list of terms
  regex:regex,
  like:InitialConfig.operators.like
};


/*const operators = {
  equals: {
    label: 'equals',
    reversedOp: 'not_equal',
    labelForFormat: '==TEST',
    cardinality: 1,
    formatOp: (field, _op, value, _valueSrc, _valueType, opDef) => `${field} ${opDef.labelForFormat} ${value}`,
    mongoFormatOp: (field, op, value) => ({ [field]: { '$eq': value } }),
  },
}*/

const stringFilter = {"eq": "eq", //Equality
                      "ne": "ne", //Disequality
                      "lt": "lt", //Less than
                      "le": "le", //Less than or equal
                      "gt": "gt",  //Greater than
                      "ge": "ge", // Greater than or equal
                      "regex": "regex",//Matches regex
                      "startsWith": "startsWith",// Matches the string prefix
                      "allOfTerms": "allOfTerms", //Contains all terms in the list of terms
                      "anyOfTerms": "anyOfTerms", //Contains any of the terms in the list of terms
                    }
// datetime
const numberFilter =  {"eq": "eq", //Equality
                      "ne": "ne", //Disequality
                      "lt": "lt", //Less than
                      "le": "le", //Less than or equal
                      "gt": "gt",  //Greater than
                      "ge": "ge" // Greater than or equal
                }

const booleanFilter ={"eq": "eq", //Equality
                "ne": "ne" //Disequality
              }


const defaultConfig = {
  ...InitialConfig,
  operators,
  types,
  fields: {
    rgb: {
        label: 'RGB',
        type: 'text',
        valueSources: ['value'],
        //operators: ['equal']
    },
    name: {
        label: 'Name',
        type: 'text',
        valueSources: ['value'],
       // operators: ['equal']
    }
  }
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = {"id": QbUtils.uuid(), "type": "group"};

export const AdvancedSearch = (props) =>{
    const [tree,setTree] = useState(QbUtils.loadTree(queryValue))

    console.log("AdvancedSearch",props.fields)
    
    const config = {...defaultConfig,fields:props.fields || {}} 
   
    const renderBuilder = (props) => (
      <div className="query-builder-container" style={{padding: '10px'}}>
        <div className="query-builder qb-lite">
            <Builder {...props} />
        </div>
      </div>
    )

    const mapField ={"AND":'_and',
                    "OR" : '_or',
                    "equal":'eq',
                    "not_equal":"ne",
                    "like":"regex",
                    "starts_with":"startsWith"}

    const getChildrenRule = (childrenArr) =>{
       const childrenArrtmp = [] 
        childrenArr.forEach(element => {
            if(element.type=="group"){
              const conjunction = mapField[element.properties.conjunction] || element.properties.conjunction
              const childrenRule = getChildrenRule(element.children1)
              if(childrenRule.length===1){
                childrenArrtmp.push(childrenRule[0])
              }else{
                childrenArrtmp.push({[conjunction] : childrenRule})
              }
            }else{
              const field = element.properties.field
              const operator = mapField[element.properties.operator] || element.properties.operator
              let value = element.properties.value[0]
              if(element.properties.operator === "like"){
                value = `(?i)${value}`
              }
              
              
              childrenArrtmp.push({[field]:{[operator]:value}})
            }  
        });
        return childrenArrtmp
    }

    const jsonStringToGraphQlFilter = (data)=>{
        let filterObj ={}
        if(data && Array.isArray(data.children1)){
           const filterObjArr = getChildrenRule( data.children1,filterObj)
           console.log("filterObj",JSON.stringify(filterObjArr,null,4))
           return  filterObjArr[0]
        }
    }

    const onClick= ()=>{
        
        const jsonTree = QbUtils.getTree(tree);
        const filter = jsonStringToGraphQlFilter(jsonTree)

        if(props.setFilter) props.setFilter(filter)


    }
    
    const onChange = (immutableTree, config) => {
      // Tip: for better performance you can apply `throttle` - see `examples/demo`
      setTree(immutableTree)
    }

    return <div>
    <Query
        {...config} 
        value={tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
      <Button onClick={()=>{onClick()}}>Filter Data</Button>
    </div>

    
}