import { use } from "react";
import { dispatchContext, stateContext } from "../provider/app";
import type { CurrentModal, Status } from "../types";
import { invalidateTasksContext, tasksContext } from "../provider/tasks";

export function useAppState() {
  const state = use(stateContext);
  if (state === undefined) throw new Error('useAppState must be used with TasksUiProvider');
  return state;
}

export function useAppDispatch() {
  const dispatch = use(dispatchContext);
  if (dispatch === undefined) throw new Error('useAppDispatch must be used with TasksUiProvider');
  return dispatch;
}

export function useChangeModal () {
  const dispatch = useAppDispatch();
  return (payload: CurrentModal) => {
    dispatch({ type: 'ADD_MODAL', payload  });
  }
}

export function useUpdateFocusArea () {
  const dispatch = useAppDispatch();
  return (payload: Status) => {
    dispatch({ type: 'FOCUS_AREA', payload  });
  }
}

export function useTasks() {
  const tasks = use(tasksContext);
  if (tasks === undefined) throw new Error('useTasks must be used within the TasksProvider');
  return tasks;
}

export function useInvalidateTasks() {
  const invalidate = use(invalidateTasksContext);
  if (invalidate === undefined) throw new Error('useTasks must be used within the TasksProvider');
  return invalidate;
}
