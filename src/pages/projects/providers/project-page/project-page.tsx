import { createContext, use, useReducer, type ReactNode } from 'react';
import type { Action, State } from './types';
import { reducer } from './reducer';

const stateContext = createContext<State | undefined>(undefined);
const dispatchContext = createContext<React.ActionDispatch<[action: Action]> | undefined>(undefined);

const initialState: State = {
  currentModal: null,
};

type Props = {
  children: ReactNode;
}

export function ProjectUiProvider(props: Props) {
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
  if (state === undefined) throw new Error('useProjectUiState must be used with ProjectUiProvider');
  return state;
}

export function useAppDispatch() {
  const dispatch = use(dispatchContext);
  if (dispatch === undefined) throw new Error('useProjectUiDispatch must be used with ProjectUiProvider');
  return dispatch;
}
