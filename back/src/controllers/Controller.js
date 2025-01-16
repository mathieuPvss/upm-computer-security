import pkg from 'pg';
import xss from 'xss';
const { Pool } = pkg;

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'postgres',
  password: 'toto',
  port: 5432,
});

export class Controller {
  static async index(request, response) {
    try {
      const result = await pool.query('SELECT NOW()');
      response.json(`The database is working: ${result.rows[0].now}`);
    } catch (err) {
      console.error(err);
      response.status(500).send('Database connection error');
    }
  }

  static async articles(request, response) {
    try {
      const { page = 1, limit = 10 } = request.query;
      const offset = (page - 1) * limit;

      const result = await pool.query(
        'SELECT * FROM articles ORDER BY id LIMIT $1 OFFSET $2',
        [parseInt(limit), parseInt(offset)]
      );

      const totalResult = await pool.query('SELECT COUNT(*) AS total FROM articles');
      const total = parseInt(totalResult.rows[0].total, 10);

      response.json({
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        articles: result.rows
      });
    } catch (err) {
      console.error(err);
      response.status(500).send('Database connection error');
    }
  }


  static async article(request, response) {
    try {
      const { id } = request.query;
      const result = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
      response.json(result.rows);
    } catch (err) {
      console.error(err);
      response.status(500).send('Database connection error');
    }
  }

  static async comments(request, response) {
    try {
      const { article_id } = request.query;
      const result = await pool.query('SELECT * FROM comments WHERE article_id = $1', [article_id]);
      response.json(result.rows);
    } catch (err) {
      console.error(err);
      response.status(500).send('Database connection error');
    }
  }

  static async addCommentWithoutCleaning(request, response) {
    console.log(request.body);
    const { article_id, content } = request.body;

    if (!article_id || !content) {
      response.status(400).send('Missing parameters');
      return;
    }

    try {
      const query = `
        INSERT INTO comments (article_id, content, comment_date) 
        VALUES (${article_id}, '${content}', '${new Date().toISOString()}')
      `;
      console.log('Query unclear:', query);
      await pool.query(query);

      response.status(201).send('Comment added');
    } catch (err) {
      console.error(err);
      response.status(500).send('Database connection error');
    }
  }


  static async addCommentWithProtection(request, response) {
    const { article_id, content } = request.body;

    if (!article_id || !content) {
      response.status(400).send('Missing parameters');
      return;
    }

    try {
      const cleanedContent = Controller.cleanData(content);
      console.log('Cleaned Content:', cleanedContent);

      // await pool.query(
      //   'INSERT INTO comments (article_id, content, comment_date) VALUES ($1, $2, $3)',
      //   [article_id, cleanedContent, new Date()]
      // );

      const query = 'INSERT INTO comments (article_id, content, comment_date) VALUES ($1, $2, $3)';
      const values = [article_id, cleanedContent, new Date()];
      const loggedQuery = query
        .replace('$1', `'${values[0]}'`)
        .replace('$2', `'${values[1]}'`)
        .replace('$3', `'${values[2].toISOString()}'`);

      console.log('Generated Query:', loggedQuery);
      await pool.query(query, values);


      response.status(201).send('Comment added');
    } catch (err) {
      console.error('Error while adding the comment:', err);
      response.status(500).send('Database connection error');
    }
  }

  // Clean the input data
  static cleanData(data) {
    if (typeof data === 'string') {
      return xss(data);
    }

    if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          data[key] = cleanData(data[key]);
        }
      }
    }

    return data;
  }
}
