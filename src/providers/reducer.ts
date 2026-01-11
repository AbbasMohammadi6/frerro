import { logToFile } from "../utils/logger";
import type { Action, State } from "./types";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FOCUS_AREA": return { ...state, focusedArea: action.payload };
    case "ADD_TODO": return { ...state, tasks: { ...state.tasks, todo: state.tasks.todo.concat(action.payload) } };
    case "ADD_MODAL": return { ...state, currentModal: action.payload };
    case "REMOVE_TASK": {
      logToFile(JSON.stringify(state.tasks[action.payload.status].filter(t => t.id !== action.payload.taskId)));

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.status]: state.tasks[action.payload.status].filter(t => t.id !== action.payload.taskId),
        },
        currentModal: null,
      }
    };
  }
}
