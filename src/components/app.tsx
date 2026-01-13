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
  const { currentModal } = useAppState();

  useKeyboard((key) => {
    if (currentModal !== null) return;

    if (!Number.isNaN(Number(key.name))) {
      const currentColumn = columns[+key.name - 1];
      if (currentColumn) dispatch({ type: 'FOCUS_AREA', payload: currentColumn.status });
    }

    if (key.name === 'n') {
      dispatch({ type: 'ADD_MODAL', payload: 'newTask' });
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
