    -- Supprimer la table "articles" si elle existe déjà
    DROP TABLE IF EXISTS articles;

    -- Créer la table "articles"
    CREATE TABLE articles (
        id SERIAL PRIMARY KEY,
        Article TEXT NULL,
        Date DATE NULL,
        Heading VARCHAR(200) NULL,
        NewsType VARCHAR(200) NULL
    );

    -- Importer les données dans la table "articles" depuis un fichier CSV
    -- Assurez-vous que le chemin vers "Articles.utf8.csv" est absolu
    -- Exemple : Remplacez C:/path/to/ par le chemin correct sur votre machine
    COPY articles(Article, Date, Heading, NewsType)
    FROM 'C:/Users/eines/upm-computer-security/datasets/Articles.utf8.csv'
    DELIMITER ','
    CSV HEADER;

    -- Supprimer la table "comments" si elle existe déjà
    DROP TABLE IF EXISTS comments;

    -- Créer la table "comments"
    CREATE TABLE comments (
        id SERIAL PRIMARY KEY,
        article_id INT NOT NULL,
        content TEXT NOT NULL,
        comment_date DATE NOT NULL,
        FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
    );
