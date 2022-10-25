
const TerminusDBClient = require("@terminusdb/terminusdb-client")

// query to get themes with image_url
export const getThemesQuery = () => {
    let WOQL=TerminusDBClient.WOQL
    return WOQL.triple("v:Themes", "rdf:type", "@schema:Theme").
        triple("v:Themes", "name", "v:Name").
        triple("v:Themes", "image_url", "v:Images")
}

// query to get lego set by theme ID
export const getLegoSetByTheme = (theme) => {
    if(!theme) return null
    let WOQL=TerminusDBClient.WOQL
    return WOQL.triple("v:LegoSet", "rdf:type", "@schema:LegoSet").
        triple("v:LegoSet", "theme", theme).
        triple("v:LegoSet", "name", "v:Name").
        triple("v:LegoSet", "year", "v:Year")
}