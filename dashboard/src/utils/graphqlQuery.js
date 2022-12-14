import {gql} from "@apollo/client";
import TerminusClient from "@terminusdb/terminusdb-client"

const material =[
    "Cardboard/Paper",
    "Cloth",
    "Foam",
    "Metal",
    "Plastic",
    "Rubber"
  ]


const category =["Bars__Ladders_and_Fences",
    "Baseplates",
    "Bricks_Sloped",
    "Belville__Scala_and_Fabuland",
    "Bricks_Curved",
    "Bricks_Round_and_Cones",
    "Bricks_Special",
    "Bricks_Wedged",
    "Bricks",
    "Clikits",
    "Containers",
    "Duplo__Quatro_and_Primo",
    "Electronics",
    "Flags__Signs__Plastics_and_Cloth",
    "HO_Scale",
    "Hinges__Arms_and_Turntables",
    "Large_Buildable_Figures",
    "Magnets_and_Holders",
    "Mechanical",
    "Minidoll_Heads",
    "Minidoll_Lower_Body",
    "Minidoll_Upper_Body",
    "Minifig_Accessories",
    "Minifig_Heads",
    "Minifig_Headwear",
    "Minifig_Lower_Body",
    "Minifig_Upper_Body",
    "Minifigs",
    "Modulex",
    "Non_Buildable_Figures__Duplo__Fabuland__etc_",
    "Stickers",
   /* Other,
    Panels,
    Plants_and_Animals,
    Plates_Angled,
    Plates_Round_Curved_and_Dishes,
    Plates_Special,
    Plates,
    Pneumatics,
    Projectiles___Launchers,
    Rock,
    Stickers,
    String__Bands_and_Reels,
    Supports__Girders_and_Cranes,
    Technic_Axles,
    Technic_Beams_Special,
    Technic_Beams,
    Technic_Bricks,
    Technic_Bushes,
    Technic_Connectors,
    Technic_Gears,
    Technic_Panels,
    Technic_Pins,
    Technic_Special,
    Technic_Steering__Suspension_and_Engine,
    Tiles_Round_and_Curved,
    Tiles_Special,
    Tiles,
    Tools,
    Transportation___Land,
    Transportation___Sea_and_Air,
    Tubes_and_Hoses,
    Wheels_and_Tyres,
    Windows_and_Doors,
    Windscreens_and_Fuselage,
    Znap*/
]

const COLOR_QUERY = gql`
  query ColorQuery($offset: Int, $limit: Int,$filter:Color_Filter) {
    Color(offset: $offset, limit: $limit,filter:$filter) {
        _id
        rgb
        name
    }
}`


const colorFields = {
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

const ELEMENT_QUERY = gql` query ElementQuery($offset: Int, $limit: Int,$orderBy:Element_Ordering,
    $filter:Element_Filter) {
    Element(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter){
      image_url
          _id
          part {
            _id
            name
          }
    }
}`

const elementFields = {
    "part":{
        label: "Part",
        type: "!group",
        subfields: {
            name: {
                label: 'Name',
                type: 'text',
                valueSources: ['value'],
                //operators: ['equal']
            }
         }
    }
}

const LEGOSET_QUERY = gql` query LegoSetQuery($offset: Int, $limit: Int, $orderBy: LegoSet_Ordering,$filter:LegoSet_Filter) {
     LegoSet(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter){
          _id
          name
          year
          theme{
            _id
            name
          }
          inventory_set{
                _id
                inventory{
                    _id
          }
         quantity
      }  		
    }
}`

const legoSetFields = {
    "theme":{
        label: "Theme",
        type: "!group",
        subfields: {name:{
                label: 'Name',
                type: 'text',
                valueSources: ['value']
            }
        }
    },
    year: {
        label: 'Year',
        type: 'text',
        valueSources: ['value'],
        //operators: ['equal']
    },
    quantity: {
        label: 'Quantity',
        type: 'number',
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

  const inventoryFields = {
    version: {
        label: 'Version',
        type: 'number',
        valueSources: ['value'],
        //operators: ['equal']
    },
    "inventory_minifigs":{
        label: "Inventory Minifigs/minifig",
        type: "!group",
        mode: "multiple",
        subfields: {
            "minifig/name": {
                        label: 'NAME',
                        type: 'text',
                        valueSources: ['value']
            } 
        } 
    },
    "inventory_parts":{
        label: "Inventory Parts/element/part",
        type: "!group",
        mode: "multiple",
        subfields: {
            "element/part/name":{
                label: 'Name',
                type: 'text',
                valueSources: ['value'],
            } /*{
                label: "Element",
                type: "!group",
                subfields: {
                    part:{
                        label: "Part",
                        type: "!group",
                        subfields: {
                            name:{
                                label: 'Name',
                                type: 'text',
                                valueSources: ['value'],
                            }
                        }
                    }
                
                }
            }  */
        }
    }
}

const INVENTORY_QUERY = gql`query InventoryQuery($offset: Int, $limit: Int, $orderBy: Inventory_Ordering,$filter:Inventory_Filter) {
    Inventory(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter){
          _id
          version 
          inventory_minifigs{
            _id
            minifig{
                _id
                name
            }
            quantity
        }
         inventory_parts{
            _id
            element{
                _id
                part {
                    _id
                    name
                }
            }
            quantity
        }
    }
}`

const InventoryTableConfig = () =>{
    const tableConfig= TerminusClient.View.table();
    tableConfig.column_order("_id","version","inventory_minifigs","inventory_parts")
  //  tableConfig.column("year").filter({"type":"string",options:{operator:"eq"}})
  //  tableConfig.column("inventory_set").filterable(false).unsortable(true)
    tableConfig.pager("remote")
    tableConfig.pagesize(10)
    return tableConfig

}



const MINIFIG_QUERY = gql` query MinifigQuery($offset: Int, $limit: Int, $orderBy: Minifig_Ordering,$filter:Minifig_Filter) {
    Minifig(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter){
          _id
          figure_number
          name
          num_parts
          img_url
          
  }
}`

const minifigFields = {
    name:{
        label: 'Name',
        type: 'text',
        valueSources: ['value'],
        //operators: ['equal']
    },
    figure_number: {
        label: 'Figure Number',
        type: 'text',
        valueSources: ['value'],
        //operators: ['equal']
    }, 
    num_part:{
        label: 'Part Number',
        type: 'number',
        valueSources: ['value'],
        //operators: ['equal']
    }
}

const PART_QUERY = gql` 
    query PartSetQuery($offset: Int, $limit: Int,$orderBy:Part_Ordering,$filter:Part_Filter) {
    Part(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter) {
        _id
        category
        material
        name
        part_number
    }
}`

const partFields = {
   
    category:{
        label: 'Category',
        valueSources: ['value'],
        operators: ["select_equals", "select_not_equals"],
        defaultOperator: "select_equals",
        type: "select",      
        fieldSettings: {
                listValues: category
            },
        },
     material:{        
            label: 'Material',
            valueSources: ['value'],
            operators: ["select_equals", "select_not_equals"],
            defaultOperator: "select_equals",
            type: "select",
            fieldSettings: {
                
                listValues: [
                    "Cardboard/Paper",
                    "Cloth",
                    "Foam",
                    "Metal",
                    "Plastic",
                    "Rubber"
                  ]
            }
        },
    name:{
            label: 'Name',
            type: 'text',
            valueSources: ['value'],
            //operators: ['equal']
        },
    part_number:{
            label: 'Part Number',
            type: 'text',
            valueSources: ['value'],
            //operators: ['equal']
    }
}


const PART_RELATION_QUERY =   gql`query PartRelationQuery($offset: Int, $limit: Int,$filter:PartRelation_Filter) {
    PartRelation(offset: $offset, limit: $limit,filter:$filter ){
        _id
        right{
            _id
            name
        }
        left{
            _id
            name
        }
        relation_type	
  }
}`


const PartRelationTableConfig = () =>{
    const tableConfig= TerminusClient.View.table();
    tableConfig.column_order("right--name","left--name","relation_type")
    tableConfig.column("relation_type").filter({"type":"list",options:{dataprovider:relationType}}).unsortable(true)
    tableConfig.column("right--name").filterable(false).unsortable(true)
    tableConfig.column("left--name").filterable(false).unsortable(true)
    tableConfig.pager("remote")
    tableConfig.pagesize(10)
    return tableConfig

}

const partRelationFields = {
    "right":{
        label: "Right",
        type: "!group",
        subfields: {
            name: {
                label: 'Name',
                type: 'text',
                valueSources: ['value'],
                //operators: ['equal']
            }
         }
    },
    "left":{
        label: "Left",
        type: "!group",
        subfields: {
            name: {
                label: 'Name',
                type: 'text',
                valueSources: ['value'],
                //operators: ['equal']
            }
         }
    },
    relation_type:{
        label: 'Relation Type',
        operators: ["select_equals", "select_not_equals"],
        defaultOperator: "select_equals",
        type: "select",
            fieldSettings: {
                listValues: relationType
        },
        valueSources: ['value'],
        //operators: ['equal']
    }
}

const  THEME_QUERY = gql`query ThemeQuery($offset: Int, $limit: Int,$orderBy: Theme_Ordering,$filter:Theme_Filter) {
    Theme(offset: $offset, limit: $limit,orderBy:$orderBy,filter:$filter){
          _id
          image_url
          name
      
  }
}`

const ThemeTableConfig = () =>{
    const tableConfig= TerminusClient.View.table();
    tableConfig.column_order("image_url","name")
    tableConfig.column("image_url").width(100).renderer({type: "image",options:{"width":"80px"}})
    tableConfig.column("image_url").filterable(false).header(" ").unsortable(true)
    tableConfig.pager("remote")
    tableConfig.pagesize(10)
    return tableConfig
}

const themeFields = {
    "name":{
        label: 'Name',
        type: 'text',
        valueSources: ['value']
    }
}

const totalAdvancedField = {
    "Theme":{
        label: "theme",
        type: "!group",
        subfields: {
            name: {
                label: 'Name',
                type: 'text',
                valueSources: ['value'],
                //operators: ['equal']
            }
        }
    },
    "LegoSet":{

    }

}


export const legoSetWeb = gql `query LegoSetWebQuery($offset: Int, $limit: Int, $orderBy: LegoSet_Ordering,$filter:LegoSet_Filter){
    LegoSet(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter){
      _id
      name
      year
      image_url
      description
      theme {
        _id
        name
      }
      inventory_set{
        _id
        inventory{
          _id
          inventory_parts{
            _id
         }
        }
      }
    }  
  }`

export const advFiltersFields={
    Color:colorFields,
    Theme:themeFields,
    LegoSet:legoSetFields,
    Inventory:inventoryFields,
    Part:partFields,
    PartRelation :partRelationFields,
    Minifig:minifigFields,
    Element:elementFields
}

export const graphqlQuery ={
    Color:COLOR_QUERY,
    Theme:THEME_QUERY,
    LegoSet:LEGOSET_QUERY,
    Inventory:INVENTORY_QUERY,
    Part:PART_QUERY,
    PartRelation :PART_RELATION_QUERY,
    Minifig:MINIFIG_QUERY,
    Element:ELEMENT_QUERY,
}

const ColorTableConfig = () =>{
    const tableConfig= TerminusClient.View.table();
    tableConfig.column_order("rgb","name")
    tableConfig.pager("remote")
    tableConfig.pagesize(10)
    return tableConfig
}
const LegoSetTableConfig = () =>{
    const tableConfig= TerminusClient.View.table();
    tableConfig.column_order("name", "theme--name" ,"year", "inventory_set")
    tableConfig.column("theme--name").unsortable(true).filter({type:"string",options:{varPath : {theme:{name:"__VALUE__"}}}})
    tableConfig.column("year").filter({"type":"string",options:{operator:"eq"}})
    tableConfig.column("inventory_set").filterable(false).unsortable(true).header("Inventory Set Quantity")
    tableConfig.pager("remote")
    tableConfig.pagesize(10)
    return tableConfig
}

const ElementTableConfig= () =>{
    const tableConfig= TerminusClient.View.table();
    tableConfig.column_order("image_url", "part--name")
    // to be review
    tableConfig.column("part--name").unsortable(true).filter({type:"string",options:{varPath : {part:{name:"__VALUE__"}}}})
    tableConfig.column("image_url").width(100).renderer({type: "image",options:{"width":"80px"}})
    tableConfig.column("image_url").filterable(false).header(" ").unsortable(true)
    tableConfig.pager("remote")
    tableConfig.pagesize(10)
    return tableConfig
}

const MinifigTableConfig= () =>{
    const tableConfig= TerminusClient.View.table();
    tableConfig.column_order("img_url","name", "num_parts","figure_number")
    tableConfig.column("img_url").width(100).renderer({type: "image",options:{"width":"80px"}})
    tableConfig.column("img_url").filterable(false).unsortable(true).header(" ")
    tableConfig.column("num_parts").filterable(false).unsortable(true)
    // tableConfig.column("material").filter({type:"list",dataprovider:material})
    // tabConfig.column_order("Time", "Author", "Commit ID", "Message", "Copy Commit ID")
    // tabConfig.column("Commit ID")
    // tabConfig.column("Time").width(180).renderer({type: "time"})
    // tabConfig.column("Message").width(300)
    // tabConfig.column("Author")
    // tabConfig.column("Copy Commit ID")
   
    // tabConfig.column("Copy Commit ID").render(getCopyButton)
    tableConfig.pager("remote")
    tableConfig.pagesize(10)
    return tableConfig
}

const relationType = ["Alternate",
                        "Mold",
                        "Pair",
                        "Pattern",
                        "Print",
                        "Sub-Part"]


const PartTableConfig= () =>{
    const tableConfig= TerminusClient.View.table();
    tableConfig.column_order("name", "material","category","part_number")
   // tableConfig.column("img_url").width(100).renderer({type: "image",options:{"width":"80px"}})
   // tableConfig.column("img_url").filterable(false)//.header(" ")
     tableConfig.column("material").filter({type:"list",options:{dataprovider:material}})
     tableConfig.column("category").filter({type:"list",options:{dataprovider:category}})
    // tabConfig.column_order("Time", "Author", "Commit ID", "Message", "Copy Commit ID")
    // tabConfig.column("Commit ID")
    // tabConfig.column("Time").width(180).renderer({type: "time"})
    // tabConfig.column("Message").width(300)
    // tabConfig.column("Author")
    // tabConfig.column("Copy Commit ID")
   
    // tabConfig.column("Copy Commit ID").render(getCopyButton)
    tableConfig.pager("remote")
    tableConfig.pagesize(10)
    return tableConfig
}

export const tableConfigObj ={
    Color:ColorTableConfig,
    Theme:ThemeTableConfig,
    LegoSet:LegoSetTableConfig,
    Inventory:InventoryTableConfig,
    Part:PartTableConfig,
    PartRelation :PartRelationTableConfig,
    Minifig:MinifigTableConfig,
    Element:ElementTableConfig
}