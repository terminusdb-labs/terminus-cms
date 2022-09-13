#!/usr/bin/env python3

import jsonlines
import pandas as pd

def dump_json(writer, list_of_objs: list):
    for obj in list_of_objs:
        writer.write(obj)

def ingest_minifigs():
    minifigs_df = pd.read_csv('./minifigs.csv')
    inserts = []
    for _,row in minifigs_df.iterrows():
        inserts.append({
            '@type' : 'Minifig',
            '@capture' : row['fig_num'],
            'name': row['name'],
            'img_url': row['img_url'],
            'num_parts': row['num_parts'],
            'figure_number' : row['fig_num']
        })
    return inserts

def ingest_inventory_minifigs():
    inventory_minifigs_df = pd.read_csv('./inventory_minifigs.csv')
    inserts = []
    for _,row in inventory_minifigs_df.iterrows():
        inserts.append({
            '@type' : 'InventoryMinifig',
            'quantity' : row['quantity'],
            'minifig' : { '@ref' : row['fig_num'] }
        })
    return inserts

def ingest_parts():
    parts_df = pd.read_csv('./parts.csv')
    inserts = []
    for _,row in parts_df.iterrows():
        inserts.append({
            '@type' : 'Part',
            'part_number' : row['part_num'],
            'category' : { '@ref' : row['part_cat_id'] },
            'name' : row['name'],
            'material' : 'Material'
        })
    return inserts

def ingest_elements(element_image_map):
    elements_df = pd.read_csv('./elements.csv')
    inserts = []
    for _,row in elements_df.iterrows():
        if row['color_id'] != -1:
            color_obj = { '@ref' : row['color_id'] }
        else:
            color_obj = None
        element_id = f"{row['part_num']} {row['color_id']}"
        inserts.append({
            '@type' : 'Element',
            '@capture' : element_id,
            'part' : row['part_num'],
            'color' : color_obj,
            'image_url' : element_image_map[element_id]
        })
    return inserts

def ingest_colors():
    colors_df = pd.read_csv('./colors.csv', skiprows=[0])
    inserts = []
    for _,row in colors_df.iterrows():
        inserts.append({
            '@type' : 'Color',
            '@capture' : row['id'],
            'name' : row['name'],
            'rgb' : row['rgb'],
            'transparent' : True if row['is_trans'] == 't' else False
        })
    return inserts

def element_key(part,color_id):
    if color_id == None:
        color_id = '++none++'
    part + ' ' + color_id

def boolean(torf):
    return torf == 't'

def ingest_inventory_parts():
    inventory_parts_df = pd.read_csv('./inventory_parts.csv')
    inserts = []
    element_image_map = {}
    for _,row in inventory_parts_df.iterrows():
        element_id = f"{row['part_num']} {row['color_id']}"
        image = None if pd.isna(row['img_url']) else row['img_url']
        element_image_map[element_id] = image
        inserts.append({
            '@type' : 'InventoryPart',
            '@capture' : row['inventor_id'],
            'quantity' : row['quantity'],
            'element' : { '@ref' : element_id},
            'spare' : boolean(row['is_spare']),
        })
    return (inserts,element_image_map)

def main():
    name = 'objs.json'
    with jsonlines.open(name, mode='w') as writer:
        dump_json(writer, ingest_minifigs())
        dump_json(writer, ingest_inventory_minifigs())
        dump_json(writer, ingest_parts())
        (objs, entity_image_map) = ingest_inventory_parts()
        dump_json(writer, objs)
        dump_json(writer, ingest_elements(entity_image_map))

if __name__ == '__main__':
    main()
