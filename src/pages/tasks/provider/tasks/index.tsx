import { db } from '@/utils/db';
import { createContext, useState, type ReactNode } from 'react';
import type { Status, Task } from '../../types';
import { reverseStatus } from '../../utils';

type Tasks = Record<Status, Task[]>;

function getTasks(projectId: number) {
  const tasks = db.query<Task, any>('SELECT * FROM tasks WHERE project_id = ?').all(projectId);
  return tasks.reduce((acc, item) => {
    const statusStr = reverseStatus[item.status];
    if (statusStr) acc[statusStr].push(item);
    return acc;
  }, { todo: [], doing: [], done: [], 'wont-do': [] } as Tasks);
}

export const invalidateTasksContext = createContext<(() => void) | undefined>(undefined);
export const tasksContext = createContext<Tasks | undefined>(undefined);

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
