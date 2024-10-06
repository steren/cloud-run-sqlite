import http from 'http';
import sqlite3 from 'sqlite3';

const path = process.env.DB_PATH || './data';
const db = new sqlite3.Database(path + '/books.db');

db.serialize(() => {
  const requestListener = (req, res) => {
    if (req.method === 'GET') {
      // Only *read* from the SQLite database.
      // Do not attempt to *write* to the database from the Cloud Run service which automatically scales to multiple instances.
      // SQLite isn't designed to be written from multiple instances.
      db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
          res.writeHead(500);
          res.end(err.message);
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
      });
    } else {
      res.writeHead(200);
      res.end('Hello, World!');
    }
  };

  const server = http.createServer(requestListener);
  const port = process.env.PORT || 8080;
  server.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
  
});