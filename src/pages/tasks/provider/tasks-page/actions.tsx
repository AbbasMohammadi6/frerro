import { useAppDispatch } from "."
import type { Status } from "../tasks/types";
import type { CurrentModal } from "./types";

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
