import type { Status } from "../tasks/types";

type CurrentModal = "newTask" | "removeTask" | 'moveTask' | 'editTask' | null;

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
