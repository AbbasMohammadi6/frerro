import { useAppDispatch, useAppState } from "../providers";
import type { Task } from "../providers/types";
import { theme } from "../theme/theme";
import { db } from "../utils/db";
import { Modal } from "./modal";
import { useKeyboard } from "@opentui/react"
import { useInvalidate } from "../providers/tasks"

type Props = {
  currentTask: Task;
  removeCurrentTask: () => void;
}

export default function RemoveModal(props: Props) {
  const { currentTask, removeCurrentTask } = props;
  const { currentModal } = useAppState();
  const invalidateTasks = useInvalidate();
  const dispatch = useAppDispatch();

  useKeyboard((key) => {
    if (currentModal !== 'removeTask') return;

    if (key.name === 'y' && currentTask) {
      db.run('DELETE FROM tasks WHERE id IS ?', [currentTask.id]);
      removeCurrentTask();
      invalidateTasks();
      dispatch({ type: 'ADD_MODAL', payload: null });
    }

    if (key.name === 'n' || key.name === 'escape') {
      dispatch({ type: 'ADD_MODAL', payload: null });
    }
  });

  return (
    <Modal>
      <box borderColor={theme.cyan} title="Remove Task...">
        <text>
          Are you sure to remove <span fg={theme.red}>{currentTask.title}</span>? y/n
        </text>
      </box>
    </Modal>

  );
}
