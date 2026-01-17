import type { AppAction, AppState } from "../../types";

export const reducer = (_: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'CHANGE_MODAL': return { currentModal: action.payload };
  }
}
