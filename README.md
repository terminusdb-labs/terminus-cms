# Installing

1. Install `docker compose`
2. Run `docker-compose pull` to make sure that you don't have an older version of the TerminusDB image somewhere
3. Run `docker-compose run ingest bash -c 'cd /app/demo_data && pip install -r requirements.txt && python3 ingest.py --no-insert'`
4. Run `docker-compose up`

# Ingestion

The ingestion from the demo data is performed automatically by the above scripts. To learn how the process works, see our [Tutorial](./Tutorial.md).

# Running

1. Visit localhost:3000 after following the installation instructions
2. Log in with `collaborator` username in the backoffice and `demo` as the password
