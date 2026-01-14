import { Database } from 'bun:sqlite';
import type { Status } from '../providers/types';

export const rootCategoryName = 'root';

function createDb() {
  const db = new Database("mydb.sqlite");
  // db.run("CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, status INTEGER)");
  db.run("CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT)");

  db.run(`CREATE TABLE IF NOT EXISTS 
    collections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      category_id INTEGER,
      FOREIGN KEY (category_id) REFERENCES category(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS 
    tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT not null,
      description TEXT,
      status INTEGER not null,
      collection_id INTEGER not null,
      FOREIGN KEY (collection_id) REFERENCES collection(id)
  )`);

  const currentCategories = db.query('SELECT * FROM categories').all();
  if (currentCategories.length === 0) {
    db.run('INSERT INTO categories (title) VALUES (?)', [rootCategoryName]);
  }
  return db;
}

export const status = {
  'todo': 1,
  'doing': 2,
  'done': 3,
  'wont-do': 4
} satisfies Record<Status, number>;

export const reverseStatus = Object.entries(status).reduce((acc, [key, value]) => {
  acc[value] = key as Status;
  return acc;
}, {} as { [K in keyof typeof status as (typeof status)[K]]: keyof typeof status });

export const db = createDb();
