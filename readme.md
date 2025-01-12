init the db:

- docker compose up -d
- docker compose exec db bash
- cd /sql
- psql -U postgres
- \i datasets/init-db.sql
