import { use } from "react";
import type { AppState } from "../types";
import { categoriesContext, dispatchContext, invalidateCategoriesContext, stateContext, } from "../providers";

export function useChangeModal() {
  const dispatch = useAppDispatch()
  return (payload: AppState['currentModal']) => {
    dispatch({ type: 'CHANGE_MODAL', payload });
  }
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

export function useCategories() {
  const tasks = use(categoriesContext);
  if (tasks === undefined) throw new Error('useCategories must be used within the CategoriesProvider');
  return tasks;
}

export function useInvalidateCategories() {
  const invalidate = use(invalidateCategoriesContext);
  if (invalidate === undefined) throw new Error('useInvalidateCategories must be used within the CategoriesProvider');
  return invalidate;
}
