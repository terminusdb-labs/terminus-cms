#!/usr/bin/env python3

import jsonlines
import csv
import os
import sys
import subprocess


def serialise_minifigs(output):
    # opening the csv file
    with open('./minifigs.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            num_parts = int(row['num_parts'])
            num_parts_val = num_parts if num_parts > 0 else None
            output.write({
                '@type' : 'Minifig',
                '@capture' : f"Minifig/{row['fig_num']}",
                'name': row['name'],
                'img_url': row['img_url'],
                'num_parts': num_parts_val,
                'figure_number' : row['fig_num']
            })

def serialise_inventory_minifigs(output):
    with open('./inventory_minifigs.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            output.write({
                '@type' : 'InventoryMinifig',
                'quantity' : int(row['quantity']),
                'minifig' : { '@ref' : f"Minifig/{row['fig_num']}" }
            })

def get_part_categories():
    with open('./part_categories.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        part_categories = {}
        for row in csv_reader:
            part_categories[row['id']] = row['name']
        return part_categories

def serialise_parts(output, part_categories):
    with open('./parts.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            output.write({
                '@type' : 'Part',
                '@capture' : f"Part/{row['part_num']}",
                'part_number' : row['part_num'],
                'category' : part_categories[row['part_cat_id']],
                'name' : row['name'],
                'material' : row['part_material']
            })


def serialise_elements(output, element_image_map):
    with open('./elements.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        elements = {}
        for row in csv_reader:
            if row['color_id'] != -1:
                color_obj = { '@ref' : f"Color/{row['color_id']}" }
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
                '@type' : 'Element',
                '@capture' : f"Element/{element_id}",
                'part' : { '@ref': f"Part/{row['part_num']}" },
                'color' : color_obj,
                'image_url' : image_url
            })
    return elements

def serialise_colors(output):
    with open('./colors.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            output.write({
                '@type' : 'Color',
                '@capture' : f"Color/{row['id']}",
                'name' : row['name'],
                'rgb' : row['rgb'],
                'transparent' : True if row['is_trans'] == 't' else False
            })

def serialise_themes(output):
    with open('./themes.csv') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            output.write({
                '@type' : 'Theme',
                '@capture' : f"Theme/{row['id']}",
                'theme_id': int(row['id']),
                'name' : row['name'],
                'parent': {'@ref': f"Theme/{row['parent_id']}"} if row['parent_id'] != '' else None
            })


def boolean(torf):
    return torf == 't'


def serialise_inventory(output, inventory_parts):
    with open('./inventories.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            inventory_id = row['id']
            parts = inventory_parts[inventory_id] if inventory_id in inventory_parts else []
            output.write({
                '@type': 'Inventory',
                'version': int(row['version']),
                'inventory_parts': parts,
                'inventory_minifigs': [],
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
        serialise_colors(writer)
        print("Serializing minifigs")
        serialise_minifigs(writer)
        print("Serializing themes")
        serialise_themes(writer)
        print("Serializing inventory minifigs")
        serialise_inventory_minifigs(writer)
        print("Get part categories")
        part_categories = get_part_categories()
        print("Serializing parts")
        serialise_parts(writer, part_categories)
        print("Creating elements image map")
#        (entity_image_map, inventory_part_map) = create_inventory_item_map()
        entity_image_map = create_element_image_map()
        print("Serializing elements")
        elements = serialise_elements(writer, entity_image_map)
        print("Creating inventory part map")
        inventory_part_map = create_inventory_part_map(elements)
        # serialise_inventory_parts(writer)
        print("Serializing inventory")
        serialise_inventory(writer, inventory_part_map)
    if "--no-insert" not in sys.argv:
        print("Inserting in DB")
        create_db(name,'../')

if __name__ == '__main__':
    main()
