import { useAppDispatch } from "./project-page"
import type { State } from "./types"

export function useChangeModal() {
  const dispatch = useAppDispatch()
  return (payload: State['currentModal']) => {
    dispatch({ type: 'CHANGE_MODAL', payload });
  }
}
