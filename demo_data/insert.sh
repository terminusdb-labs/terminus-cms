#!/bin/bash

if [ ! -f /app/terminusdb/storage ]; then
	./terminusdb store init
	./terminusdb db create admin/lego
	./terminusdb doc insert admin/lego -g schema < /app/demo_data/schema.json
	./terminusdb doc insert admin/lego < /app/demo_data/objs.json
fi
./terminusdb serve
