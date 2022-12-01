#!/bin/bash

if [ ! -d /app/terminusdb/storage/db ]; then
        ./terminusdb store init
        ./terminusdb organization create terminuscms
        ./terminusdb db create terminuscms/change_requests
        ./terminusdb doc insert terminuscms/change_requests -f -g schema < /app/demo_data/schema_change_requests.json
        # Create roles AppAdmin, Writer and Reader
        ./terminusdb role create AppAdmin branch class_frame clone commit_read_access commit_write_access fetch instance_read_access instance_write_access meta_read_access meta_write_access push rebase schema_read_access
        ./terminusdb role create Writer branch class_frame commit_read_access commit_write_access instance_read_access instance_write_access meta_read_access meta_write_access schema_read_access
        ./terminusdb role create Reader instance_read_access
        # Create users
        ./terminusdb user create collaborator -p demo
        ./terminusdb user create appAdmin -p demo
        ./terminusdb user create anyUser -p demo
        # Grant capabilities
        ./terminusdb capability grant collaborator terminuscms Writer -s organization
        ./terminusdb capability grant appAdmin terminuscms AppAdmin -s organization
        ./terminusdb capability grant anyUser terminuscms Reader -s organization
        # Create lego DB
	./terminusdb db create terminuscms/lego
	./terminusdb doc insert terminuscms/lego -f -g schema < /app/demo_data/schema.json
	./terminusdb doc insert terminuscms/lego < /app/demo_data/objs.json
fi

if [ "$1" != "--only-insert" ]; then
        ./terminusdb serve
fi
