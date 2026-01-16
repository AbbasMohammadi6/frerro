import type { Action, State } from "./types";

export const reducer = (_: State, action: Action): State => {
  switch (action.type) {
    case 'CHANGE_MODAL': return { currentModal: action.payload };
  }
}
