import { useKeyboard } from "@opentui/react"
import { useState } from "react"
import type { Status, Task } from "../providers/types"
import { useAppState, useAppDispatch } from "../providers"
import { theme } from "../theme/theme"
import { Modal } from "./modal"
import { useInvalidate, useTasks } from "../providers/tasks"
import { db } from "../utils/db"
import { MoveModal } from "./move-modal"

interface Todo {
  id: number
  title: string
}

interface TodosByStatus {
  todo: Todo[]
  doing: Todo[]
  done: Todo[]
  "wont-do": Todo[]
}

interface ColumnProps {
  title: string
  status: keyof TodosByStatus
}

export function Column({ title, status }: ColumnProps) {
  const { focusedArea, currentModal } = useAppState();
  const tasks = useTasks();
  const focused = focusedArea === status;
  const columnTasks = tasks[status];
  const [currentTask, setCurrentTask] = useState<null | Task>(null);
  const selected = currentTask !== null;
  const dispatch = useAppDispatch();
  const invalidateTasks = useInvalidate();

  useKeyboard((key) => {
    if (currentModal !== null) return;

    if (!focused) return

    if (key.name === "return") {
      const firstTask = columnTasks[0];
      if (firstTask) {
        setCurrentTask(firstTask);
      }
    }

    if (key.name === "tab") {
      setCurrentTask(null);
    }

    if (currentTask) {
      const currentIndex = columnTasks.findIndex(todo => todo.id === currentTask.id);

      if (key.name === "j") {
        const nextTodo = columnTasks.at(currentIndex + 1);
        if (nextTodo) setCurrentTask(nextTodo);
      }

      if (key.name === "k") {
        const prevTodo = columnTasks.at(currentIndex - 1);
        if (prevTodo) setCurrentTask(prevTodo);
      }

      if (key.name === "q") {
        setCurrentTask(null);
      }

      if (key.name === "-") {
        dispatch({ type: 'ADD_MODAL', payload: 'removeTask' });
      }

      if (key.name === 'm' && currentTask) {
        dispatch({ type: 'ADD_MODAL', payload: 'moveTask' });
      }

    }
  })

  useKeyboard((key) => {
    if (currentModal !== 'removeTask') return;

    if (key.name === 'y' && currentTask) {
      db.run('DELETE FROM tasks WHERE id IS ?', [currentTask.id]);
      setCurrentTask(null);
      invalidateTasks();
      dispatch({ type: 'ADD_MODAL', payload: null });
    }

    if (key.name === 'n' || key.name === 'escape') {
      dispatch({ type: 'ADD_MODAL', payload: null });
    }
  });


  useKeyboard((key) => {
    if (currentModal !== 'moveTask') return;

    if (key.name === 'escape') {
      dispatch({ type: 'ADD_MODAL', payload: null });
    }
  });

  const borderColor = selected ? theme.light_blue : focused ? theme.info_yellow : undefined;

  return (
    <>
      <scrollbox title={title} border flexGrow={1} borderColor={borderColor}>
        {tasks[status].map(todo => (
          <text
            key={todo.id}
            fg={currentTask?.id === todo.id ? theme.light_blue : undefined}
          >
            {currentTask?.id === todo.id ? "▶ " : "• "}{todo.title}
          </text>
        ))}
      </scrollbox>

      {currentModal === 'removeTask' && (
        <Modal>
          <box borderColor={theme.cyan} title="Remove Task...">
            <text>
              Are you sure to remove <span fg={theme.red}>{currentTask?.title}</span>? y/n
            </text>
          </box>
        </Modal>
      )}

      {currentModal === 'moveTask' && currentTask && (
        <MoveModal currentTask={currentTask} status={status} />
      )}
    </>
  )
}

export type { Todo, TodosByStatus }
