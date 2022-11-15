import {gql} from "@apollo/client";
import TerminusClient from "@terminusdb/terminusdb-client"

const COLOR_QUERY = gql`
  query ColorQuery($offset: Int, $limit: Int,$filter:Color_Filter) {
    Color(offset: $offset, limit: $limit,filter:$filter) {
        id
        rgb
        name
    }
}`

const ELEMENT_QUERY = gql` query ElementQuery($offset: Int, $limit: Int,$orderBy:Element_Ordering,
    $filter:Element_Filter) {
    Element(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter){
      image_url
          id
          part {
            id
        name
          }
    }
}`

const LEGOSET_QUERY = gql` query LegoSetQuery($offset: Int, $limit: Int, $orderBy: LegoSet_Ordering,$filter:LegoSet_Filter) {
     LegoSet(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter){
          id
          name
          year
          inventory_set{
                id
                inventory{
                    id
            }
            quantity
      }  		
    }
}`

const INVENTORY_QUERY = gql`query InventoryQuery($offset: Int, $limit: Int, $orderBy: Inventory_Ordering,$filter:Inventory_Filter) {
    Inventory(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter){
          id
          version 
          inventory_minifigs{
            id
            minifig{
                id
            }
            quantity
        }
        inventory_parts{
            id
            element{
                id
            }
            quantity
        }
    }
}`

const MINIFIG_QUERY = gql` query MinifigQuery($offset: Int, $limit: Int, $orderBy: Minifig_Ordering,$filter:Minifig_Filter) {
    Minifig(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter){
          id
      figure_number
          name
          num_parts
          img_url
          
  }
}`

const PART_QUERY = gql` 
    query PartSetQuery($offset: Int, $limit: Int,$orderBy:Part_Ordering,$filter:Part_Filter) {
    Part(offset: $offset, limit: $limit, orderBy:$orderBy,filter:$filter) {
        id
        category
        material
        name
        part_number
    }
}`


const PART_RELATION_QUERY =   gql`query PartRelationQuery($offset: Int, $limit: Int,$orderBy:PartRelation_Ordering,$filter:PartRelation_Filter) {
    PartRelation(offset: $offset, limit: $limit,orderBy:$orderBy,filter:$filter){
        id
        right{
            id
            name
        }
        left{
            id
            name
        }
        relation_type	
  }
}`

const  THEME_QUERY = gql`query ThemeQuery($offset: Int, $limit: Int,$orderBy: Theme_Ordering,$filter:Theme_Filter) {
    Theme(offset: $offset, limit: $limit,orderBy:$orderBy,filter:$filter){
          id
          image_url
          name
      
  }
}`



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
    tableConfig.column_order("name", "year","inventory_set")
    tableConfig.column("year").filter({"type":"string",options:{operator:"eq"}})
    tableConfig.column("inventory_set").filterable(false).unsortable(true)
    tableConfig.pager("remote")
    tableConfig.pagesize(10)
    return tableConfig

}

const ElementTableConfig= () =>{
    const tableConfig= TerminusClient.View.table();
    tableConfig.column_order("image_url", "part--name")
    // to be review
    tableConfig.column("part--name").unsortable(true).filter({type:"string",options:{varPath : {Part:{name:"__VALUE__"}}}})
    tableConfig.column("image_url").width(100).renderer({type: "image",options:{"width":"80px"}})
    tableConfig.column("image_url").filterable(false).header(" ").unsortable(true)
    tableConfig.pager("remote")
    tableConfig.pagesize(10)
    return tableConfig
}

const MinifigTableConfig= () =>{
    const tableConfig= TerminusClient.View.table();
    tableConfig.column_order("name", "num_parts","img_url")
    tableConfig.column("img_url").width(100).renderer({type: "image",options:{"width":"80px"}})
    tableConfig.column("img_url").filterable(false)//.header(" ")
    tableConfig.column("num_parts").width(100).filter({type: "number"})
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
    "Minidoll_Upper_Body"
 /*   Minifig_Accessories,
    Minifig_Heads,
    Minifig_Headwear,
    Minifig_Lower_Body,
    Minifig_Upper_Body,
    Minifigs,
    Modulex,
    Non_Buildable_Figures__Duplo__Fabuland__etc_,
    Non_LEGO,
    Other,
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
    Znap,*/
]

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
    //Theme:THEME_QUERY,
    LegoSet:LegoSetTableConfig,
    //Inventory:INVENTORY_QUERY,
    Part:PartTableConfig,
    //PartRelation :PART_RELATION_QUERY,
    Minifig:MinifigTableConfig,
    Element:ElementTableConfig
}