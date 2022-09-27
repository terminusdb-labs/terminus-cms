# Lego part management CMS

Lego provide a case study of products which have complex content
models. This includes large numbers of parts which are members of
hierarchical assemblages. Each part can go into multiple lego sets, and
lego sets are made up of multiple assemblages of parts (called
inventories). In addition each part has specialisations on colours,
which may be limited depending on the part type.

This provides a microcosm of the types of difficulties encountered in
managing data about parts in many manufacturing domains. We hope that
this tutorial can help you to get started using Terminus CMS for your
own inventory, product line or manufacturing use-case.

## Modelling

The first stage when creating a new Terminus CMS is to model the
objects that you will need to be representing in the system. This is
often an iterative process with ingestion from sources, where the data
model is tweaked to incorporate all information which is already known.

For our example, we take a set of CSVs containing information from
[rebrickable](https://rebrickable.com/) which has both official Lego
Sets, as well as custom designs.

The first part of the schema is the context. This tells us which fully
qualified names we are going to use for classes and properties
(`@schema`) and for each data objects id (`@base`). These choices will
allow us to name things safely, allowing external programs to refer to
these names and such that we can merge data later while keeping
referential integrity.

```json
[
  { "@type" : "@context",
    "@base" : "terminusdb:///lego/data/",
    "@schema" : "terminusdb:///lego/schema#"
  },
...
]
```

Now we need to define the objects which are refered to in our CSVs. The first is the `Part`.

```json
[
...
  {
    "@type": "Class",
    "@id": "Part",
    "@key": {
      "@type": "Lexical",
      "@fields": [
        "part_number"
      ]
    },
    "part_number": "xsd:string",
    "category": "Category",
    "name": "xsd:string",
    "material": "Material"
  },
...
]
```

A part has a part_number, a category (which is itself an object) a
name, and a material. The `@key` field defines what makes this object
unique, much in the same way we might do for a table in SQL. In this
case it is the part number which we use to designate uniqueness.

Next we define materials:

```
[
...
  {
    "@type": "Enum",
    "@id": "Material",
    "@value": [
      "Cardboard/Paper",
      "Cloth",
      "Foam",
      "Metal",
      "Plastic",
      "Rubber"
    ]
  },
...
]
```

This is an `Enum`, which is a choice of one of a number of distinct
values. Materials must always be one of these values.

`Parts` are essentially shapes, but we also have colors and these are
defined with the class `Element`.

```
[
...
  {
    "@id": "Element",
    "@type": "Class",
    "part": "Part",
    "color": {
      "@type": "Optional",
      "@class": "Color"
    },
    "image_url": {
      "@type" : "Optional",
      "@class" : "xsd:anyURI"
    }
  }
...
]
```

An element is a combination of a color, and a part, along with an
image which shows what it looks like. Both the color and image_url are
designated as "Optional", as can be seen from the above.

Schema modelling proceeds in this fashion building up all of the
elements which can be seen in [schema.json](demo_data/schema.json).

## Ingest

Once we have built up the model we need to read the various documents
into the database. We will do this in two stages, the first building
up JSON objects representing our data, and the second, importing them
into the database.

### Stage 1: Defining the objects. 

The [ingest.py](demo_data/ingest.py) script performs the heavy lifting
for transforming the data.

The process is broken into steps, each of which imports a single CSV.

The first step is to read in
[part\_catagories.csv](demo_data/part_categories.csv), which defines
the categories to which parts belong. We will simply hold in a
dictionary in memory.

```python
def get_part_categories():
    with open('./part_categories.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        part_categories = {}
        for row in csv_reader:
            part_categories[row['id']] = row['name']
        return part_categories
```

Next we can read the parts, which are present in [parts.csv](demo_data/parts.csv)

```python
def serialize_parts(output, part_categories):
    with open('./parts.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            output.write({
                '@type': 'Part',
                '@capture': f"Part/{row['part_num']}",
                'part_number': row['part_num'],
                'category': part_categories[row['part_cat_id']],
                'name': row['name'],
                'material': row['part_material']
            })
```

This function gets a JSON output stream (`output`) and a dictionary of
part categories which we built up earlier.

A few things are worth noticing. We create a `@capture` with the
f-string `f"Part/{row['part_num']}"`. This capture is a name which
standards for the ID which will be assigned to this

We open the csv file.
