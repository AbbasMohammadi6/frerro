import { createContext, use, useReducer, type ReactNode } from 'react';
import type { Action, State } from './types';
import { reducer } from './reducer';
import tasks from '../tasks.json';

const stateContext = createContext<State | undefined>(undefined);
const dispatchContext = createContext<React.ActionDispatch<[action: Action]> | undefined>(undefined);

const initialState: State = {
  focusedArea: 'todo',
  tasks,
  currentModal: null,
};

type Props = {
  children: ReactNode;
}

export function Provider(props: Props) {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <dispatchContext.Provider value={dispatch}>
      <stateContext.Provider value={state}>{children}</stateContext.Provider>
    </dispatchContext.Provider>
  );
}

export function useAppState() {
  const state = use(stateContext);
  if (state === undefined) throw new Error('useAppState must be used with Provider');
  return state;
}

export function useAppDispatch() {
  const dispatch = use(dispatchContext);
  if (dispatch === undefined) throw new Error('useAppDispatch must be used with Provider');
  return dispatch;
}
