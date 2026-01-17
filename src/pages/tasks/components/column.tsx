import { useKeyboard } from "@opentui/react"
import { useEffect, useState } from "react"
import { theme } from "@/theme"
import { TaskItem } from "./task-item"
import { MoveModal } from "./move-task"
import { RemoveItemModal } from "@/components/remove-item-modal"
import { db } from "@/utils"
import { UpsertTaskModal, type Task as SubmmittedTask } from "./upsert-task"
import type { Status, Task } from "../types"
import { useAppState, useChangeModal, useInvalidateTasks } from "../hooks"

interface ColumnProps {
  title: string;
  status: Status;
  tasks: Task[];
}

export function Column(props: ColumnProps) {
  const { title, status, tasks } = props;
  const { focusedArea, currentModal } = useAppState();
  const focused = focusedArea === status;
  const [currentTask, setCurrentTask] = useState<null | Task>(null);
  const invalidateTasks = useInvalidateTasks();
  const changeModal = useChangeModal();

  useEffect(() => {
    if (status === focusedArea) {
      const firstTask = tasks[0];
      if (firstTask) setCurrentTask(firstTask);
    }
    else setCurrentTask(null);
  }, [status, focusedArea]);

  const closeModal = () => changeModal(null);

  useKeyboard((key) => {
    if (currentModal !== null) return;
    if (!focused) return

    const currentIndex = tasks.findIndex(todo => todo.id === currentTask?.id);

    if (key.name === "j") {
      const firstTask = tasks.at(-1);
      if (currentTask === null && firstTask) setCurrentTask(firstTask);

      const nextTodo = tasks.at(currentIndex + 1);
      if (nextTodo) setCurrentTask(nextTodo);
    }

    if (key.name === "k") {
      if (currentIndex <= 0) return;
      const prevTodo = tasks.at(currentIndex - 1);
      if (prevTodo) setCurrentTask(prevTodo);
    }

    if (currentTask) {
      if (key.name === "-") changeModal('removeTask');
      if (key.name === 'm') changeModal('moveTask');
      if (key.name === 'e') changeModal('editTask');
    }
  })

  const submitRemove = () => {
    if (!currentTask) return;
    db.run('DELETE FROM tasks WHERE id IS ?', [currentTask.id]);
    setCurrentTask(null)
    invalidateTasks();
    closeModal();
  }

  const borderColor = focused ? theme.info_yellow : undefined;

  const submitEditTask = ({ title, description }: SubmmittedTask) => {
    if (!currentTask) return;
    db.run('UPDATE tasks SET title = ?, description = ? WHERE ID = ?', [title, description ?? null, currentTask.id]);
    invalidateTasks();
    closeModal();
    // TODO: can not set the currentTask to the edited task, because it sees the old value, see if this could be fixed
    setCurrentTask(null);

  }

  return (
    <>
      <scrollbox border title={title} flexGrow={1} borderColor={borderColor}>
        {tasks.map(task => <TaskItem key={task.id} isActive={currentTask?.id === task.id} task={task} />)}
      </scrollbox>

      {currentTask && (
        <>
          {currentModal === 'removeTask' &&
            <RemoveItemModal
              type='task'
              close={closeModal}
              name={currentTask.title}
              submitRemove={submitRemove}
            />}

          {currentModal === 'moveTask' &&
            <MoveModal currentTask={currentTask} status={status} />}

          {currentModal === 'editTask' &&
            <UpsertTaskModal
              close={closeModal}
              currentTask={{ title: currentTask.title, description: currentTask.description }}
              submitTask={submitEditTask}
            />}
        </>
      )}
    </>
  )
}
