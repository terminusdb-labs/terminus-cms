#!/usr/bin/env python3

import json
import pandas as pd


def ingest_minifigs():
    minifigs_df = pd.read_csv('./minifigs.csv')
    inserts = []
    for row in minifigs_df.iterrows():
        inserts.append({
            'name': row['name'],
            'img_url': row['img_url'],
            'num_parts': row['num_parts']
        })
    return inserts

def dump_json(name: str, list_of_objs: list):
    with open(name, 'w') as f:
        f.write(json.dumps(list_of_objs))


def main():
    dump_json('minifigs.json', ingest_minifigs())

if __name__ == '__main__':
    main()
