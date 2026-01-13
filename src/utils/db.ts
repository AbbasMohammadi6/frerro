import { Database } from 'bun:sqlite';
import type { Status } from '../providers/types';

function createDb() {
  const db = new Database("mydb.sqlite");
  db.run("CREATE TABLE IF NOT EXISTS TASKS (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, status INTEGER)");
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
