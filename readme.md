Init the db:

- docker compose up -d
- docker compose exec db bash
- cd /sql
- psql -U postgres
- \i datasets/init-db.sql

Connection to the database via adminer:

--> http://localhost:8080/

- systeme: postgres
- serveur: db
- utilisateur: postgres
- mot de passe: toto

Access to the website:

- docker compose up -d
- click on the file index.html ("/front/index.html")
