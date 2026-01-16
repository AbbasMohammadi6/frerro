export type Task = {
  id: number,
  title: string;
  status: number;
  project_id: number;
  description?: string;
}

export type Status = 'todo' | 'doing' | 'done' | 'wont-do';
