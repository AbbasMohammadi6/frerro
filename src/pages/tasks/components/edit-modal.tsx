import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import type { Task } from "../provider/tasks/types";
import { useAppDispatch, useAppState } from "../provider/tasks-page";
import { useInvalidateTasks } from "../provider/tasks";
import { db } from "@/utils/db";
import { Modal } from "@/components";
import { theme } from "@/theme";

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
  const invalidateTasks = useInvalidateTasks();

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
