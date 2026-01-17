import { createContext, useReducer, type ReactNode } from 'react';
import { reducer } from './reducer';
import type { AppAction, AppState } from '../../types';

export const stateContext = createContext<AppState | undefined>(undefined);
export const dispatchContext = createContext<React.ActionDispatch<[action: AppAction]> | undefined>(undefined);

const initialState: AppState = {
  currentModal: null,
};

type Props = {
  children: ReactNode;
}

export function AppProvider(props: Props) {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <dispatchContext.Provider value={dispatch}>
      <stateContext.Provider value={state}>{children}</stateContext.Provider>
    </dispatchContext.Provider>
  );
}

