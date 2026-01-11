type Status = 'todo' | 'doing' | 'done' | 'wont-do';

export type Task = {
  id: number,
  title: string;
}

export type Tasks = Record<Status, Task[]>;
type CurrentModal = "newTask" | "removeTask" | null;

export type State = {
  focusedArea: Status;
  tasks: Tasks;
  currentModal: CurrentModal;
};

export type Action = | {
  type: 'FOCUS_AREA';
  payload: State['focusedArea'];
} | {
  type: 'ADD_TODO';
  payload: Task;
} | {
  type: 'ADD_MODAL';
  payload: CurrentModal;
} | {
  type: 'REMOVE_TASK';
  payload: {
    taskId: Task['id'],
    status: Status;
  };
};
