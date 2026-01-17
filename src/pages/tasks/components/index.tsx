import { theme } from "@/theme";
import { useKeyboard } from "@opentui/react"
import { useChangeRoute } from "@/providers/routes";
import { Column } from "./column";
import { UpsertTaskModal, type Task } from "./upsert-task";
import { db } from "@/utils";
import { useMemo } from "react";
import type { Status } from "../types";
import { useAppState, useChangeModal, useInvalidateTasks, useTasks, useUpdateFocusArea } from "../hooks";

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
  // TODO: this is not performant, just done for learing porpuses, we could get projectName and categoryName from context
  const parentsData = useMemo(() => {
    return db.query<{ projectTitle: string, categoryTitle: string }, [number]>(
      `select p.title as projectTitle, c.title as categoryTitle
      from projects p
      inner join categories c
      on p.category_id = c.id
      where p.id = ?`
    ).get(projectId);
  }, []);

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
    <>
      <box
        paddingTop={1}
        paddingLeft={1}
        paddingRight={1}
        backgroundColor={currentModal ? theme.popup_back : theme.bg}
      >
        <box flexDirection='row'>
          {columns.map(({ title, status }) => (
            <Column title={title} status={status} tasks={tasks[status]} />
          ))}
        </box>

        {parentsData && <text>{parentsData.categoryTitle} / {parentsData.projectTitle}</text>}
      </box>

      {currentModal === 'newTask' && <UpsertTaskModal close={closeModal} submitTask={submitNewTask} />}
    </>
  )
}
