import { Database } from 'bun:sqlite';
import type { Status } from '../providers/types';

function createDb() {
  const db = new Database("mydb.sqlite");
  db.run("CREATE TABLE IF NOT EXISTS TASKS (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, status INTEGER)");
  return db;
}

export const status: Record<Status, number> = {
  'todo': 1,
  'doing': 2,
  'done': 3,
  'wont-do': 4
};

export const db = createDb();
