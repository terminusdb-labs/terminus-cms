 export const classDocuments = [
    {
        "@id": "Color",
        "@type": "Class",
        "name": "xsd:string",
        "rgb": "xsd:string",
        "transparent": "xsd:boolean"
    },
    {
        "@id": "Element",
        "@type": "Class",
        "color": {
            "@class": "Color",
            "@type": "Optional"
        },
        "image_url": {
            "@class": "xsd:anyURI",
            "@type": "Optional"
        },
        "part": "Part"
    },
    {
        "@id": "Inventory",
        "@type": "Class",
        "inventory_minifigs": {
            "@class": "InventoryMinifig",
            "@type": "Set"
        },
        "inventory_parts": {
            "@class": "InventoryPart",
            "@type": "Set"
        },
        "version": "xsd:positiveInteger"
    },
    {
        "@id": "InventoryMinifig",
        "@key": {
            "@fields": [
                "inventory_minifig_id"
            ],
            "@type": "Lexical"
        },
        "@subdocument": [],
        "@type": "Class",
        "inventory_minifig_id": "xsd:string",
        "minifig": "Minifig",
        "quantity": "xsd:positiveInteger"
    },
    {
        "@id": "InventoryPart",
        "@key": {
            "@fields": [
                "inventory_part_id"
            ],
            "@type": "Lexical"
        },
        "@subdocument": [],
        "@type": "Class",
        "element": "Element",
        "inventory_part_id": "xsd:string",
        "quantity": "xsd:positiveInteger",
        "spare": "xsd:boolean"
    },
    {
        "@id": "InventorySet",
        "@key": {
            "@type": "Random"
        },
        "@subdocument": [],
        "@type": "Class",
        "inventory": "Inventory",
        "quantity": "xsd:positiveInteger"
    },
    {
        "@id": "LegoSet",
        "@type": "Class",
        "description": {
            "@class": "xsd:string",
            "@type": "Optional"
        },
        "image_url": {
            "@class": "xsd:anyURI",
            "@type": "Optional"
        },
        "inventory_set": {
            "@class": "InventorySet",
            "@type": "Set"
        },
        "name": "xsd:string",
        "theme": "Theme",
        "year": "xsd:gYear"
    },
    {
        "@id": "Minifig",
        "@key": {
            "@fields": [
                "figure_number"
            ],
            "@type": "Lexical"
        },
        "@type": "Class",
        "figure_number": "xsd:string",
        "img_url": "xsd:anyURI",
        "name": "xsd:string",
        "num_parts": {
            "@class": "xsd:positiveInteger",
            "@type": "Optional"
        }
    },
    {
        "@id": "Part",
        "@key": {
            "@fields": [
                "part_number"
            ],
            "@type": "Lexical"
        },
        "@type": "Class",
        "category": "Category",
        "material": "Material",
        "name": "xsd:string",
        "part_number": "xsd:string"
    },
    {
        "@id": "PartRelation",
        "@type": "Class",
        "left": "Part",
        "relation_type": "RelationType",
        "right": "Part"
    },
    {
        "@id": "Theme",
        "@key": {
            "@fields": [
                "theme_id",
                "name"
            ],
            "@type": "Lexical"
        },
        "@type": "Class",
        "image_url": {
            "@class": "xsd:anyURI",
            "@type": "Optional"
        },
        "name": "xsd:string",
        "parent": {
            "@class": "Theme",
            "@type": "Optional"
        },
        "theme_id": "xsd:positiveInteger"
    }
]