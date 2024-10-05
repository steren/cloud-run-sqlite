import sqlite3 from 'sqlite3';

// TODO: customize this function with your own logic, for example listing and parsing files from a local directory
async function getBooks() {
  return [
    { title: 'The Hitchhiker\'s Guide to the Galaxy' },
    { title: 'Pride and Prejudice' },
    { title: '1984' }
  ];
}

const path = process.env.DB_PATH || './data';
const db = new sqlite3.Database(path + '/books.db');
db.serialize(async () => {
  db.run("CREATE TABLE IF NOT EXISTS books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)");
  console.log('Created table books');

  const booksToInsert = await getBooks();

  const stmt = db.prepare("INSERT INTO books(title) VALUES (?)");

  booksToInsert.forEach(book => {
    stmt.run(book.title);
    console.log(`Inserted book ${book.title}`);
  });

  stmt.finalize();
  console.log('Finished populating database');
});
