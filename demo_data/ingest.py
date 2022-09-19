#!/usr/bin/env python3

import jsonlines
import csv
import os
import sys
import subprocess


def serialize_minifigs(output):
    # opening the csv file
    with open('./minifigs.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            num_parts = int(row['num_parts'])
            num_parts_val = num_parts if num_parts > 0 else None
            output.write({
                '@type': 'Minifig',
                '@capture': f"Minifig/{row['fig_num']}",
                'name': row['name'],
                'img_url': row['img_url'],
                'num_parts': num_parts_val,
                'figure_number': row['fig_num']
            })


def get_part_categories():
    with open('./part_categories.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        part_categories = {}
        for row in csv_reader:
            part_categories[row['id']] = row['name']
        return part_categories


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

def serialize_part_relationships(output):
    rel_type_enum = {
        "A": "Alternate",
        "M": "Mold",
        "R": "Pair",
        "T": "Pattern",
        "P": "Print",
        "B": "Sub-Part",
    }
    with open('./part_relationships.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            rel_type = rel_type_enum[row['rel_type']]
            output.write({
                '@type': 'PartRelation',
                'relation_type': rel_type,
                'left': {'@ref': f"Part/{row['child_part_num']}"},
                'right': {'@ref': f"Part/{row['parent_part_num']}"},
            })


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


def serialize_colors(output):
    with open('./colors.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            output.write({
                '@type': 'Color',
                '@capture': f"Color/{row['id']}",
                'name': row['name'],
                'rgb': row['rgb'],
                'transparent': True if row['is_trans'] == 't' else False
            })


def serialize_themes(output):
    with open('./themes.csv') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            output.write({
                '@type': 'Theme',
                '@capture': f"Theme/{row['id']}",
                'theme_id': int(row['id']),
                'name': row['name'],
                'parent': {'@ref': f"Theme/{row['parent_id']}"} if row['parent_id'] != '' else None
            })


def serialize_sets(output, set_inventory_map):
    with open('./sets.csv') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            set_id = row['set_num']
            sets = set_inventory_map[set_id] if set_id in set_inventory_map else []
            output.write({
                '@type': 'LegoSet',
                '@capture': f"LegoSet/{set_id}",
                'theme': {"@ref": f"Theme/{row['theme_id']}"},
                'name': row['name'],
                'year': int(row['year']),
                'inventory_set': sets,
            })


def boolean(torf):
    return torf == 't'


def serialize_inventory(output, inventory_parts, minifig_map):
    with open('./inventories.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            inventory_id = row['id']
            parts = inventory_parts[inventory_id] if inventory_id in inventory_parts else []
            minifigs = minifig_map[inventory_id] if inventory_id in minifig_map else []
            output.write({
                '@type': 'Inventory',
                '@capture': f"Inventory/{inventory_id}",
                'version': int(row['version']),
                'inventory_parts': parts,
                'inventory_minifigs': minifigs,
            })


def create_element_image_map():
    with open('./inventory_parts.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        element_image_map = {}
        for row in csv_reader:
            element_id = f"{row['part_num']} {row['color_id']}"
            image = None if row['img_url'] == '' else row['img_url']
            element_image_map[element_id] = image
        return element_image_map


def create_inventory_minifig_map():
    with open('./inventory_minifigs.csv') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        inventory_minifig_map = {}
        for row in csv_reader:
            inventory_id = row['inventory_id']
            if inventory_id not in inventory_minifig_map:
                inventory_minifig_map[inventory_id] = []
            inventory_minifig_map[inventory_id].append({
                'inventory_minifig_id': inventory_id + row['fig_num'],
                'quantity': int(row['quantity']),
                'minifig': { '@ref': f"Minifig/{row['fig_num']}" }
            })
    return inventory_minifig_map


def create_inventory_set_map():
    with open('./inventory_sets.csv') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        set_inventory_map = {}
        for row in csv_reader:
            set_id = row['set_num']
            if set_id not in set_inventory_map:
                set_inventory_map[set_id] = []
            set_inventory_map[set_id].append({
                'quantity': int(row['quantity']),
                'inventory': { '@ref': f"Inventory/{row['inventory_id']}" }
            })
    return set_inventory_map


def create_inventory_part_map(elements):
    with open('./inventory_parts.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        inventory_part_map = {}
        for row in csv_reader:
            element_id = f"{row['part_num']} {row['color_id']}"
            # There are some missing elements that we should skip :(
            if element_id not in elements:
                continue
            inventory_part_map[row['inventor_id']] = {
                '@type' : 'InventoryPart',
                '@capture' : f"InventoryPart/{row['inventor_id']}",
                'inventory_part_id': f"{row['inventor_id']}{element_id}",
                'quantity' : int(row['quantity']),
                'element' : { '@ref' : f"Element/{element_id}"},
                'spare' : boolean(row['is_spare']),
            }
    return inventory_part_map


def create_db(name, cwd):
    terminusdb_path = 'terminusdb' if 'TERMINUSDB_EXECUTABLE' not in os.environ else os.environ['TERMINUSDB_EXECUTABLE']
    subprocess.call([terminusdb_path, 'store', 'init', '--force'], cwd=cwd)
    subprocess.call([terminusdb_path, 'db', 'create', 'admin/lego'], cwd=cwd)
    with open('schema.json', 'r') as f:
        process = subprocess.Popen(['terminusdb', 'doc', 'insert', 'admin/lego', '-f', '-g', 'schema'],
                                   cwd=cwd,
                                   stdin=f)
        process.wait()
    with open('objs.json', 'r') as f:
        process = subprocess.Popen([terminusdb_path, 'doc', 'insert', 'admin/lego'],
                                   cwd=cwd,
                                   stdin=f)
        process.wait()

def main():
    name = 'objs.json'
    with jsonlines.open(name, mode='w') as writer:
        print("Serializing colors")
        serialize_colors(writer)
        print("Serializing minifigs")
        serialize_minifigs(writer)
        print("Serializing themes")
        serialize_themes(writer)
        print("Get part categories")
        part_categories = get_part_categories()
        print("Serializing parts")
        serialize_parts(writer, part_categories)
        print("Creating elements image map")
        entity_image_map = create_element_image_map()
        print("Serializing elements")
        elements = serialize_elements(writer, entity_image_map)
        print("Creating inventory part map")
        inventory_part_map = create_inventory_part_map(elements)
        print("Creating inventory minifig map")
        minifig_inventory_map = create_inventory_minifig_map()
        print("Serializing inventory")
        serialize_inventory(writer, inventory_part_map, minifig_inventory_map)
        print("Creating and serializing inventory sets")
        inventory_set_map = create_inventory_set_map()
        serialize_sets(writer, inventory_set_map)
        serialize_part_relationships(writer)
    if "--no-insert" not in sys.argv:
        print("Inserting in DB")
        create_db(name, '../')


if __name__ == '__main__':
    main()
