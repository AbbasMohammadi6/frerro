import { db, reverseStatus } from '@/utils/db';
import { createContext, use, useState, type ReactNode } from 'react';
import type { Status, Task } from './types';

type Tasks = Record<Status, Task[]>;

function getTasks(projectId: number) {
  const tasks = db.query<Task, any>('SELECT * FROM tasks WHERE project_id = ?').all(projectId);
  return tasks.reduce((acc, item) => {
    const statusStr = reverseStatus[item.status];
    if (statusStr) acc[statusStr].push(item);
    return acc;
  }, { todo: [], doing: [], done: [], 'wont-do': [] } as Tasks);
}

const invalidateTasksContext = createContext<(() => void) | undefined>(undefined);
const tasksContext = createContext<Tasks | undefined>(undefined);

type Props = {
  children: ReactNode;
  projectId: number
}

export function TasksProvider(props: Props) {
  const { children, projectId } = props;
  const [tasks, setTasks] = useState<Tasks>(() => getTasks(projectId) /* move this to useEffect */);

  const invalidate = () => {
    const updatedTasks = getTasks(projectId);
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

export function useInvalidateTasks() {
  const invalidate = use(invalidateTasksContext);
  if (invalidate === undefined) throw new Error('useTasks must be used within the TasksProvider');
  return invalidate;
}
