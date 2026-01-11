import { useKeyboard } from "@opentui/react"
import { Column } from "./column"
import Input from "./input";
import { Modal } from "./modal";
import { useAppDispatch, useAppState } from "../providers";
import type { State } from "../providers/types";
import { theme } from "../theme/theme";

// const TASKS_PATH = join(import.meta.dir, "..", "tasks.json")

export function App() {
  const dispatch = useAppDispatch();
  const { focusedArea, currentModal, tasks } = useAppState();

  // useEffect(() => {
    // TODO: find a way to write to file without rerendering the app
    // writeFile(TASKS_PATH, JSON.stringify(tasks), () => void 0);
  // }, [tasks]);

  useKeyboard((key) => {
    if (currentModal !== null) return;

    if (key.name === "tab") {
      const areas: State['focusedArea'][] = ["todo", "doing", "done", "wont-do"]
      const currentIndex = areas.indexOf(focusedArea)
      const nextIndex = (currentIndex + 1) % areas.length
      const nextArea = areas[nextIndex]
      if (nextArea) {
        dispatch({ type: 'FOCUS_AREA', payload: nextArea });
      }
    }

    if (key.name === 'n') {
      dispatch({ type: 'ADD_MODAL', payload: 'newTask' });
    }
  });

  return (
    <box position="relative" backgroundColor={currentModal ? theme.popup_back : theme.bg}>

      <box flexDirection={'row'} padding={1} gap={1} height='100%'>
        <Column title="Todo" status="todo" />
        <Column title="Doing" status="doing" />
        <Column title="Done" status="done" />
        <Column title="Won't Do" status="wont-do" />
      </box>

      {currentModal === 'newTask' && (<Modal><Input /></Modal>)}
    </box>
  )
}
