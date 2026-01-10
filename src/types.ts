type Column = 'todo' | 'doing' | 'done' | 'wont-do';

export type Task = {
  id: number,
  title: string;
}

export type Tasks = Record<Column, Task[]>;

export type State = {
  focusedArea: Column | 'input';
  focusedTodo: number | null;
  tasks: Tasks;
};

export type Action = | {
  type: 'FOCUS_AREA';
  payload: State['focusedArea'];
} | {
  type: 'FOCUS_TODO';
  payload: State['focusedTodo'];
} | {
  type: 'ADD_TODO';
  payload: Task;
};
