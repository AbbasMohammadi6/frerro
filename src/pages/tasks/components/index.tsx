import { theme } from "@/theme";
import { useKeyboard } from "@opentui/react"
import { useChangeRoute } from "@/providers/routes";
import { useInvalidateTasks, useTasks } from "../provider/tasks";
import { Column } from "./column";
import { useAppState } from "../provider/tasks-page";
import type { Status } from "../provider/tasks/types";
import { UpsertTaskModal, type Task } from "./upsert-task";
import { db } from "@/utils/db";
import { useChangeModal, useUpdateFocusArea } from "../provider/tasks-page/actions";

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
  const { currentModal } = useAppState();
  const tasks = useTasks();
  const changeRoute = useChangeRoute();
  const invalidateTasks = useInvalidateTasks();
  const changeModal = useChangeModal();
  const updateFocusArea = useUpdateFocusArea();

  useKeyboard((key) => {
    if (currentModal !== null) return;

    if (!Number.isNaN(Number(key.name))) {
      const currentColumn = columns[+key.name - 1];
      if (currentColumn) updateFocusArea(currentColumn.status);
    }

    if (key.name === 'n') changeModal('newTask');

    if (key.name === 'b') changeRoute({ name: 'projects' });
  });

  const submitNewTask = ({ title, description }: Task) => {
    db.run(
      'INSERT INTO TASKS (title, status, description, project_id) VALUES (?, 1, ?, ?)',
      [title, description ?? null, projectId]
    );
    invalidateTasks();
  }

  const closeModal = () => changeModal(null);

  return (
    <box backgroundColor={currentModal ? theme.popup_back : theme.bg}>

      <box flexDirection='row' padding={1} gap={1} height='100%'>
        {columns.map(({ title, status }) => (
          <Column title={title} status={status} tasks={tasks[status]} />
        ))}
      </box>

      {currentModal === 'newTask' &&
        <UpsertTaskModal close={closeModal} submitTask={submitNewTask} />}
    </box>
  )
}
