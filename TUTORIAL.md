# Lego part management in TerminusCMS

Lego provide a case study of products which have complex content
models. This includes large numbers of parts which are members of
hierarchical assemblages. Each part can go into multiple lego sets, and
lego sets are made up of multiple assemblages of parts (called
inventories). In addition each part has specialisations on colours,
which may be limited depending on the part type.

Lego sets are a nice microcosm of the type of content which is typical
for various inventory, product line, manufacturing and engineering
content management problems.

TerminusDB is a full knowledge management system and not just about
content display. It enables fast and effective:

* Modelling of content
* Ingestion of content
* Curation of content
* Display of content
* Query and content analytics

We found that various CMS technologies were strong at some of these
and weak at others, but in particular the long term value of data
increases substantially if it can be leveraged to perform query and
content analytics on the real curated data rather than some data which
is available only after extraction to other analytics
systems. TerminusCMS gives you all of these at once, increasing long
term agility of your data.

We hope that this tutorial can help you to get started using Terminus
CMS for your own use-case.

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
f-string `f"Part/{row['part_num']}"`. This capture is a name which we
use as a place holder for the ID which will be assigned to this object
by the TerminusDB. It is essentially a kind of forward reference which
we can then reuse with a `@ref` elsewhere.

We can see the re-fuse of this name in the following code for `serialize_elements`.

```python
def serialize_elements(output, element_image_map):
    with open('./elements.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        elements = {}
        for row in csv_reader:
            if row['color_id'] != -1:
                color_obj = {'@ref' : f"Color/{row['color_id']}"}
            else:
                color_obj = None
            element_id = f"{row['part_num']} {row['color_id']}"
            if element_id in elements:
                continue
            elements[element_id] = True
            if element_id in element_image_map:
                image_url = element_image_map[element_id]
            else:
                image_url = None
            output.write({
                '@type': 'Element',
                '@capture': f"Element/{element_id}",
                'part': {'@ref': f"Part/{row['part_num']}"},
                'color': color_obj,
                'image_url': image_url
            })
    return elements
```

Here we refer to the part we created with the reference: `{'@ref':
f"Part/{row['part_num']}"}`. Note: the `Part/` prefix here, is not
syntax, it is simply a useful convention to avoid colliding with other
names we might use for references.

In TerminusCMS we can also specify *back references* to things which
should contain us. This is extremely helpful when trying to build a
graph from CSV.

```
def serialize_inventory_minifigs(output):
    with open('./inventory_minifigs.csv') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            inventory_id = row['inventory_id']
            inventory_minifig_id = f"{inventory_id} {row['fig_num']}"
            output.write({
                '@type': "InventoryMinifig",
                '@linked-by': {"@ref": f"Inventory/{inventory_id}",
                               "@property": "inventory_minifigs"},
                'inventory_minifig_id': inventory_minifig_id,
                'quantity': int(row['quantity']),
                'minifig': {'@ref': f"Minifig/{row['fig_num']}"}
            })
```

In serializing inventory minifigs we specify a field `@linked-by`
which refers to another object by reference and says that we must be
one of the elements pointed to by its `inventory_minifigs`
property.

By inserting this object we ensure that when the ingestion transaction
completes, the approriate `Inventory` object will point to us, even
though it is not specified in the document we generated with
`serialize_inventory`. This is the easiest way to add large
collections of linked objects to some container.

### Stage 2: Loading the objects

The functions we looked at essentially just open a csv, and spit out
JSON objects. These JSON objects we write to a file. Then we can load
these by ingesting this file into the database with the command:

```shell
./terminusdb doc insert terminuscms/lego < /app/demo_data/objs.json
```

The actual command to perform this insertion is in the
[insert.sh](demo_data/insert.sh) file which takes care of all of our
initialisation.

That's all there is to getting your data in TerminusCMS!

## After Ingestion: Content Management

Once you've entered all of the data, it is possible to extend the data
using the Administration dashboard in TerminusCMS. This will let you
add, delete, and modify existing objects as defined in your schema.

TODO!

## Displaying the Data

The primary inent a headless CMS is to enable fast and effective
development of display and accessbility of content. TerminusCMS helps
to make this simply by allowing your team maximum flexibility in how
you perform display. TerminusCMS gives some tools to assist in this,
but can also get out of the way completely if it is so desired,
enabling content creators to use familiar tools such as GraphQL to
obtain required content.

TODO!

## Content Analytics and Query

TODO!


