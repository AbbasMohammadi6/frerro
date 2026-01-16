import type { Action, State } from "./types";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FOCUS_AREA": return { ...state, focusedArea: action.payload };
    case "ADD_MODAL": return { ...state, currentModal: action.payload };
  }
}
