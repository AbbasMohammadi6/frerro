import { theme } from "@/theme";
import { useKeyboard } from "@opentui/react"
import { useChangeRoute } from "@/providers/routes";
import { useInvalidateTasks, useTasks } from "../provider/tasks";
import { Column } from "./column";
import { useAppDispatch, useAppState } from "../provider/tasks-page";
import type { Status } from "../provider/tasks/types";
import { UpsertTaskModal, type Task } from "./upsert-task-modal";
import { db } from "@/utils/db";

const columns: Array<{ title: string, status: Status }> = [
  { title: "Todo (1)", status: "todo" },
  { title: "Doing (2)", status: "doing" },
  { title: "Done (3)", status: "done" },
  { title: "Won't Do (4)", status: "wont-do" },
];

type Props = {
  projectId: number;
}

export function Tasks(props: Props) {
  const { projectId } = props;
  const dispatch = useAppDispatch();
  const { currentModal } = useAppState();
  const tasks = useTasks();
  const changeRoute = useChangeRoute();
  const invalidateTasks = useInvalidateTasks();

  useKeyboard((key) => {
    if (currentModal !== null) return;

    if (!Number.isNaN(Number(key.name))) {
      const currentColumn = columns[+key.name - 1];
      if (currentColumn) dispatch({ type: 'FOCUS_AREA', payload: currentColumn.status });
    }

    if (key.name === 'n') dispatch({ type: 'ADD_MODAL', payload: 'newTask' });

    if (key.name === 'b') changeRoute({ name: 'projects' });
  });

  const submitNewTask = ({ title, description }: Task) => {
      db.run(
        'INSERT INTO TASKS (title, status, description, project_id) VALUES (?, 1, ?, ?)',
        [title, description, projectId]
      );
      invalidateTasks();
  }

  const closeModal = () => dispatch({ type: 'ADD_MODAL', payload: null });

  return (
    <box backgroundColor={currentModal ? theme.popup_back : theme.bg}>

      <box flexDirection='row' padding={1} gap={1} height='100%'>
        {columns.map(({ title, status }) => (
          <Column title={title} status={status} tasks={tasks[status]} />
        ))}
      </box>

      {currentModal === 'newTask' &&
        <UpsertTaskModal
          close={closeModal}
          submitTask={submitNewTask}
        />}
    </box>
  )
}
