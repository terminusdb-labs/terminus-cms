import data from "./test_chart.js"

export function getData(){
const nodesObj = {}
const linkEdges = []

const bindings = data.bindings || []
// filter: { fields: { slug: { startsWith: $prefix } } }
//console.log("START" ,data)
nodesObj['legoSet']= {
            "collisionRadius" : 90,
            "type": "node",
            "id": "legoSet",
            "icon" : {label:true},
            "nodetype": "LegoSet",
            "color": [166, 216, 84],
            "text": "AT-TE Walker",
            "radius":60
        }

function rexToRgb(rexStr ){
    if(typeof rexStr!=="string")return []
    var aRgbHex = rexStr.match(/.{1,2}/g);
    if(aRgbHex.length!==3) return []
    return [
        parseInt(aRgbHex[0], 16),
        parseInt(aRgbHex[1], 16),
        parseInt(aRgbHex[2], 16)
        ]
}

bindings.forEach(item=>{
    // inventory doc connected with data set throw inventory_set subdoc

    const iconInvLabel = {unicode:"\uf1b2",size:"2"} 

    nodesObj[item['inventory']] =  {
                    "collisionRadius" : 90,
                    "type": "node",
                    "id": item['inventory'],
                    "icon" : iconInvLabel, //{label:true},
                    "nodetype": "Inventory",
                    "color":  [252, 141, 98],
                    "text": item['inventory'],
                    "radius":50
                }
    
    const invQuantity =  item['inventoryQuantity'] ?  item['inventoryQuantity']['@value'] : "no quantity"
    linkEdges.push ({
                    "type": "link",
                    "target": item['inventory'],
                    "source": "legoSet",
                    "text": invQuantity,
                    "size": 2,
                    "icon": {
                        "label": true,
                        "color": [
                            109,
                            98,
                            100
                        ],
                        "size": 1
                    },
                    "arrow": {
                        "width": 50,
                        "height": 20,
                        "offset" : 33//calculateOffset(propValue)
                    }
    })

    //inventory_part suddocument creates a relation between inventory and elements
    const elementColor =  item['colorRGB'] ? rexToRgb(item['colorRGB']['@value']) : [255, 178, 102]

    //\uf009
    const iconLabel =  {unicode:"\uf12e",size:"2"} //: {label:true}

    nodesObj[item['element']] =  {
        "collisionRadius" : 90,
        "type": "node",
        "id": item['element'],
        "icon" : iconLabel,//{label:true},
        "nodetype": "Element",
        "color":  [141, 160, 203],//[102, 194, 165],
        "text": "Element",
        "radius":40
    }
    //relationship inventory ---> elements
    const elementQuantity =  item['elementQuantity'] ?  item['elementQuantity']['@value'] : "no quantity"
    linkEdges.push ({
                    "type": "link",
                    "target": item['element'],
                    "source": item['inventory'],
                    "text": elementQuantity,
                    "size": 2,
                    "icon": {
                        "label": true,
                        "color": [
                            109,
                            98,
                            100
                        ],
                        "size": 1
                    },
                    "arrow": {
                        "width": 50,
                        "height": 20,
                        "offset" : 33// calculateOffset(propValue)
                    }
    })
    const partName =item['partName'] ? item['partName']['@value'] : "no name"
    const partCategory =item['partCategory'] ? item['partCategory']['@value'] : ""
    const image = item['elementImage'] ?  item['elementImage']['@value'] : null

    nodesObj[item['part']] =  {
        "collisionRadius" : 90,
        "type": "node",
        "id": item['part'],
        "icon" : {},
        "nodetype": "Part",
        "color": elementColor,
        "image" : image, //"https://cdn.rebrickable.com/media/parts/elements/6378419.jpg",
        "text": partName + '' + partCategory,
        "radius":30
    }

    linkEdges.push ({
        "type": "link",
        "target": item['part'],
        "source": item['element'],
        "text": "part",
        "size": 2,
        "icon": {
            "label": true,
            "color": [
                109,
                98,
                100
            ],
            "size": 1
        },
        "arrow": {
            "width": 50,
            "height": 20,
            "offset" : 33//calculateOffset(propValue)
        }
})

console.log(JSON.stringify(nodesObj,null,2))


})
return {nodesObj,linkEdges}
}