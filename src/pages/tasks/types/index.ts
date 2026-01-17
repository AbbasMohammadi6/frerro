export type Task = {
  id: number,
  title: string;
  status: number;
  project_id: number;
  description?: string;
}

export type Status = 'todo' | 'doing' | 'done' | 'wont-do';

export type CurrentModal = "newTask" | "removeTask" | 'moveTask' | 'editTask' | null;

export type State = {
  focusedArea: Status;
  currentModal: CurrentModal;
};

export type Action = | {
  type: 'FOCUS_AREA';
  payload: State['focusedArea'];
} | {
  type: 'ADD_MODAL';
  payload: CurrentModal;
};
