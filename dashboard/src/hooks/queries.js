
const TerminusDBClient = require("@terminusdb/terminusdb-client")

// query to get themes with image_url
export const getThemesQuery = () => {
    let WOQL=TerminusDBClient.WOQL
    return WOQL.triple("v:Themes", "rdf:type", "@schema:Theme").
        triple("v:Themes", "name", "v:Name").
        triple("v:Themes", "image_url", "v:Images")
}

// query to get lego set by theme ID
export const getLegoSetByTheme = (themeName) => {
    if(!themeName) return null
    let WOQL=TerminusDBClient.WOQL
    return WOQL.order_by(["v:InventoryPart", "desc"]).triple("v:Theme", "rdf:type", "@schema:Theme").
            triple("v:Theme", "name", WOQL.string(themeName)).
            triple("v:LegoSet", "theme", "v:Theme").
            triple("v:LegoSet", "name", "v:Name").
            triple("v:LegoSet", "year", "v:Year").
            opt().triple("v:LegoSet", "inventory_set" ,"v:InventorySet")
            .opt().triple("v:InventorySet","inventory","v:Inventory")
            .opt().triple("v:Inventory","inventory_parts","v:InventoryPart")
}

export const getLegoSetGraphQuery = (legoSet) => {
    if(!legoSet) return null
    let WOQL=TerminusDBClient.WOQL
    return WOQL.triple("v:legoSet","rdf:type","@schema:LegoSet")
    .triple("v:legoSet","name", WOQL.string(legoSet))
    .triple("v:legoSet","inventory_set","v:invertorySet")
    .triple("v:invertorySet","@schema:inventory","v:inventory")
    .triple("v:invertorySet","@schema:quantity","v:inventoryQuantity")
    .triple("v:inventory","@schema:inventory_parts","v:inventoryPart")
    .triple("v:inventoryPart","quantity","v:elementQuantity") 
    .triple("v:inventoryPart","element","v:element")
    .triple("v:element","color","v:elementColor")
    .triple("v:element","image_url","v:elementImage")
    .triple("v:elementColor","name","v:colorName")
    .triple("v:elementColor","rgb","v:colorRGB")
    .triple("v:element","part","v:part")
    .triple("v:part","name","v:partName")
    .triple("v:part","material","v:partMaterial")
}