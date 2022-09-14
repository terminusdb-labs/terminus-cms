#!/usr/bin/env python3

import jsonlines
import csv
import os
import subprocess

def dump_json(writer, list_of_objs: list):
    for obj in list_of_objs:
        writer.write(obj)

def serialise_minifigs(output):
    # opening the csv file
    with open('./minifigs.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        inserts = []
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
        inserts = []
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
        inserts = []
        for row in csv_reader:
            output.write({
                '@type' : 'Part',
                'part_number' : row['part_num'],
                'category' : part_categories[row['part_cat_id']],
                'name' : row['name'],
                'material' : row['part_material']
            })

def serialise_elements(output,element_image_map):
    with open('./elements.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        inserts = []
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
                'part' : row['part_num'],
                'color' : color_obj,
                'image_url' : image_url
            })

def serialise_colors(output):
    with open('./colors.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        inserts = []
        for row in csv_reader:
            output.write({
                '@type' : 'Color',
                '@capture' : f"Color/{row['id']}",
                'name' : row['name'],
                'rgb' : row['rgb'],
                'transparent' : True if row['is_trans'] == 't' else False
            })


def boolean(torf):
    return torf == 't'

def serialise_inventory_parts(output):
    with open('./inventory_parts.csv') as csv_file:
        # reading the csv file using DictReader
        csv_reader = csv.DictReader(csv_file)
        inserts = []
        element_image_map = {}
        for row in csv_reader:
            element_id = f"{row['part_num']} {row['color_id']}"
            image = None if row['img_url'] == '' else row['img_url']
            element_image_map[element_id] = image
            inserts.append({
                '@type' : 'InventoryPart',
                '@capture' : f"InventoryPart/{row['inventor_id']}",
                'quantity' : int(row['quantity']),
                'element' : { '@ref' : f"Element/{element_id}"},
                'spare' : boolean(row['is_spare']),
            })
        return element_image_map

def create_db(name, cwd):
    subprocess.call(['terminusdb', 'store', 'init', '--force'], cwd=cwd)
    subprocess.call(['terminusdb', 'db', 'create', 'admin/lego'], cwd=cwd)
    with open('schema.json', 'r') as f:
        process = subprocess.Popen(['terminusdb', 'doc', 'insert', 'admin/lego', '-f', '-g', 'schema'],
                                   cwd=cwd,
                                   stdin=f)
        process.wait()
    with open('objs.json', 'r') as f:
        process = subprocess.Popen(['terminusdb', 'doc', 'insert', 'admin/lego'],
                                   cwd=cwd,
                                   stdin=f)
        process.wait()

def main():
    name = 'objs.json'
    with jsonlines.open(name, mode='w') as writer:
        serialise_minifigs(writer)
        serialise_inventory_minifigs(writer)
        part_categories = get_part_categories()
        serialise_parts(writer,part_categories)
        entity_image_map = serialise_inventory_parts(writer)
        serialise_elements(writer,entity_image_map)
    create_db(name,'../')

if __name__ == '__main__':
    main()
