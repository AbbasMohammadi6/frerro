import { useState } from "react";
import type { Status } from "../providers/types";
import { db, reverseStatus } from "../utils/db";
import { logToFile } from "../utils/logger";

type Task = {
  id: number,
  title: string;
  status: number;
}

type Tasks = Record<Status, Omit<Task, 'status'>[]>;

function getTasks() {
  const query = db.query<Task, any>('select * from tasks');
  const tasks = query.all();
  return tasks.reduce((acc, item) => {
    const { status, ...rest } = item;
    const statusStr = reverseStatus[item.status];
    if (statusStr) acc[statusStr].push(rest);
    return acc;
  }, { todo: [], doing: [], done: [], 'wont-do': [] } as Tasks);
}

export function useTasks() {
  const [tasks, setTasks] = useState<Tasks>(getTasks /* move this to useEffect */);

  const invalidate = () => {
    logToFile('invalidate was called');
    const updatedTasks = getTasks();
    logToFile(JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  }

  return [tasks, invalidate] as const;
}
