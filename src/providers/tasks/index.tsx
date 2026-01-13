import { createContext, use, useState, type ReactNode } from 'react';
import type { Status } from '../types';
import { db, reverseStatus } from '../../utils/db';

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

const invalidateTasksContext = createContext<(() => void) | undefined>(undefined);
const tasksContext = createContext<Tasks | undefined>(undefined);

type Props = {
  children: ReactNode;
}

export function TasksProvider(props: Props) {
  const { children } = props;
  const [tasks, setTasks] = useState<Tasks>(getTasks /* move this to useEffect */);

  const invalidate = () => {
    const updatedTasks = getTasks();
    setTasks(updatedTasks);
  }

  return (
    <invalidateTasksContext.Provider value={invalidate}>
      <tasksContext.Provider value={tasks}>
        {children}
      </tasksContext.Provider>
    </invalidateTasksContext.Provider>
  );
}

export function useTasks() {
  const tasks = use(tasksContext);
  if (tasks === undefined) throw new Error('useTasks must be used within the TasksProvider');
  return tasks;
}

export function useInvalidate() {
  const invalidate = use(invalidateTasksContext);
  if (invalidate === undefined) throw new Error('useTasks must be used within the TasksProvider');
  return invalidate;
}
