DROP TABLE IF EXISTS articles;
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    Article TEXT NULL,
    Date DATE NULL,
    Heading VARCHAR(200) NULL,
    NewsType VARCHAR(200) NULL
);

COPY articles(Article, Date, Heading, NewsType)
FROM '/sql/datasets/Articles.utf8.csv'
DELIMITER ','
CSV HEADER;

DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    article_id INT NOT NULL,
    content TEXT NOT NULL,
    comment_date DATE NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
);