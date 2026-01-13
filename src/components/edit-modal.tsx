import { useState } from "react";
import type { Task } from "../providers/types"
import { theme } from "../theme/theme";
import { Modal } from "./modal";
import { useKeyboard } from "@opentui/react";
import { useAppDispatch, useAppState } from "../providers";
import { useInvalidate } from "../providers/tasks";
import { db } from "../utils/db";
import { logToFile } from "../utils/logger";

type Props = {
  currentTask: Task;
}

export function EditModal(props: Props) {
  const { currentTask } = props;
  const { currentModal } = useAppState();
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(currentTask.title);
  const invalidateTasks = useInvalidate();

  const onChange = (val: string) => {
    setValue(val);
  }

  useKeyboard((key) => {
    if (currentModal !== 'editTask') return;
    if (key.name === 'return') {
      db.run('UPDATE tasks SET title = ? WHERE ID = ?', [value, currentTask.id]);
      invalidateTasks();
      dispatch({ type: 'ADD_MODAL', payload: null });
    }

    if (key.name === 'escape') {
      dispatch({ type: 'ADD_MODAL', payload: null });
    }
  });

  return (
    <Modal>
      <box border width='100%' height={3} borderColor={theme.cyan} title="Edit Task...">
        <input focused value={value} onInput={onChange} />
      </box>
    </Modal>
  );
}
