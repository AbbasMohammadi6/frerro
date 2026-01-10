import type { Action, State } from "./types";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FOCUS_AREA": return { ...state, focusedArea: action.payload };
    case "FOCUS_TODO": return state;
    case "ADD_TODO": return { ...state, tasks: { ...state.tasks, todo: state.tasks.todo.concat(action.payload) } };
  }

  return state;
}
