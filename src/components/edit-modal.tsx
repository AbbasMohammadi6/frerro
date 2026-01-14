import { useState } from "react";
import type { Task } from "../providers/types"
import { theme } from "../theme/theme";
import { Modal } from "./modal";
import { useKeyboard } from "@opentui/react";
import { useAppDispatch, useAppState } from "../providers";
import { useInvalidate } from "../providers/tasks";
import { db } from "../utils/db";

type Props = {
  currentTask: Task;
}

export function EditModal(props: Props) {
  const { currentTask } = props;
  const { currentModal } = useAppState();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState(currentTask.title);
  const [description, setDescription] = useState(currentTask.description ?? '')
  const [focused, setFocused] = useState<'title' | 'description'>("title")
  const invalidateTasks = useInvalidate();

  useKeyboard((key) => {
    if (currentModal !== 'editTask') return;
    if (key.name === 'return') {
      db.run('UPDATE tasks SET title = ?, description = ? WHERE ID = ?', [title, description, currentTask.id]);
      invalidateTasks();
      dispatch({ type: 'ADD_MODAL', payload: null });
    }

    if (key.name === 'tab') setFocused(prev => prev === 'title' ? 'description' : 'title');

    if (key.name === 'escape') {
      dispatch({ type: 'ADD_MODAL', payload: null });
    }
  });

  return (
    <Modal>
      <box border width='100%' height={'auto'} borderColor={theme.cyan} title="Edit Task...">
        <box borderColor={theme.gray}>
          <input
            height={1}
            value={title}
            onInput={setTitle}
            placeholder='Title'
            focused={focused === 'title'}
            backgroundColor={theme.bg}
          />
        </box>

        <box borderColor={theme.gray}>
          <input
            height={1}
            value={description}
            onInput={setDescription}
            placeholder='Description'
            focused={focused === 'description'}
          />
        </box>
      </box>
    </Modal>
  );
}
