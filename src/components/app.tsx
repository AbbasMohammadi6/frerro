import { useKeyboard } from "@opentui/react"
import { Column } from "./column"
import Input from "./input";
import { Modal } from "./modal";
import { useAppDispatch, useAppState } from "../providers";
import type { State, Status } from "../providers/types";
import { theme } from "../theme/theme";

const columns: Array<{ title: string, status: Status }> = [
  { title: "Todo (1)", status: "todo" },
  { title: "Doing (2)", status: "doing" },
  { title: "Done (3)", status: "done" },
  { title: "Won't Do (4)", status: "wont-do" },
];

export function App() {
  const dispatch = useAppDispatch();
  const { focusedArea, currentModal } = useAppState();

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

    if (!Number.isNaN(Number(key.name))) {
      const currentColumn = columns[+key.name - 1];
      if (currentColumn) dispatch({ type: 'FOCUS_AREA', payload: currentColumn.status });
    }

    if (key.name === 'n') {
      dispatch({ type: 'ADD_MODAL', payload: 'newTask' });
    }

    if (key.name === 'q') {
      process.exit(0);
    }

  });

  return (
    <box backgroundColor={currentModal ? theme.popup_back : theme.bg}>

      <box flexDirection={'row'} padding={1} gap={1} height='100%'>
        {columns.map(({ title, status }) => (
          <Column title={title} status={status} />
        ))}
      </box>

      {currentModal === 'newTask' && (<Modal><Input /></Modal>)}
    </box>
  )
}
