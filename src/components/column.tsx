import { useKeyboard } from "@opentui/react"
import { useEffect, useState } from "react"
import type { Task } from "../providers/types"
import { useAppState, useAppDispatch } from "../providers"
import { theme } from "../theme/theme"
import { MoveModal } from "./move-modal"
import RemoveModal from "./remove-modal"
import { EditModal } from "./edit-modal"
import TaskItem from "./task-item"

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
  tasks: Task[];
}

export function Column(props: ColumnProps) {
  const { title, status, tasks } = props;
  const { focusedArea, currentModal } = useAppState();
  const focused = focusedArea === status;
  const [currentTask, setCurrentTask] = useState<null | Task>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === focusedArea) {
      const firstTask = tasks[0];
      if (firstTask) setCurrentTask(firstTask);
    }
    else setCurrentTask(null);
  }, [status, focusedArea]);

  useKeyboard((key) => {
    if (currentModal !== null) return;
    if (!focused) return

    if (currentTask) {
      const currentIndex = tasks.findIndex(todo => todo.id === currentTask.id);

      if (key.name === "j") {
        const nextTodo = tasks.at(currentIndex + 1);
        if (nextTodo) setCurrentTask(nextTodo);
      }

      if (key.name === "k") {
        if (currentIndex === 0) return;
        const prevTodo = tasks.at(currentIndex - 1);
        if (prevTodo) setCurrentTask(prevTodo);
      }

      if (key.name === "-") {
        dispatch({ type: 'ADD_MODAL', payload: 'removeTask' });
      }

      if (key.name === 'm' && currentTask) {
        dispatch({ type: 'ADD_MODAL', payload: 'moveTask' });
      }

      if (key.name === 'e' && currentTask) {
        dispatch({ type: 'ADD_MODAL', payload: 'editTask' });
      }
    }
  })


  const borderColor = focused ? theme.info_yellow : undefined;

  return (
    <>
      <scrollbox title={title} border flexGrow={1} borderColor={borderColor}>
        {tasks.map(task => (
          <TaskItem key={task.id} isActive={currentTask?.id === task.id} task={task} />
        ))}
      </scrollbox>

      {currentModal === 'removeTask' && currentTask && (
        <RemoveModal currentTask={currentTask} removeCurrentTask={() => setCurrentTask(null)} />
      )}

      {currentModal === 'moveTask' && currentTask && (
        <MoveModal currentTask={currentTask} status={status} />
      )}

      {currentModal === 'editTask' && currentTask && (
        <EditModal currentTask={currentTask} />
      )}
    </>
  )
}

export type { Todo, TodosByStatus }
