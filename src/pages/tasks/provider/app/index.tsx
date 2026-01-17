import { createContext, use, useReducer, type ReactNode } from 'react';
import { reducer } from './reducer';
import type { Action, State } from '../../types';

export const stateContext = createContext<State | undefined>(undefined);
export const dispatchContext = createContext<React.ActionDispatch<[action: Action]> | undefined>(undefined);

const initialState: State = {
  focusedArea: 'todo',
  currentModal: null,
};

type Props = {
  children: ReactNode;
}

// TODO: change my name
export function AppProvider(props: Props) {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <dispatchContext.Provider value={dispatch}>
      <stateContext.Provider value={state}>{children}</stateContext.Provider>
    </dispatchContext.Provider>
  );
}
