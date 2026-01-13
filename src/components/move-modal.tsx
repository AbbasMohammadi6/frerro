import type { ComponentProps } from "react";
import type { Status, Task } from "../providers/types";
import { theme } from "../theme/theme";
import { logToFile } from "../utils/logger";
import { Modal } from "./modal";
import Select from "./select-status";
import { db, reverseStatus, status as statusMap } from "../utils/db";
import { useInvalidate } from "../providers/tasks";

type Props = {
  currentTask: Task;
  status: Status;
}

type Option = { label: string, value: Status };

const defaultMoveOptions: Array<Option> = [
  { label: "Todo", value: 'todo' },
  { label: 'Doing', value: 'doing' },
  { label: 'Done', value: 'done' },
  { label: "Wont' Do", value: 'wont-do' },
];

export function MoveModal(props: Props) {
  const { currentTask, status } = props;
  const moveOptions = defaultMoveOptions.filter(o => o.value !== status);
  const invalidateTasks = useInvalidate();

  const onSelect: ComponentProps<typeof Select>['onSelect'] = (option) => {
    if (option === null) return;
    db.run('UPDATE tasks SET status = ? WHERE ID = ?', [(statusMap as any)[option.value], currentTask.id]);
    invalidateTasks();
  }

  return (
    <Modal>
      <box borderColor={theme.cyan} title="Move Task...">
        <text>
          Changing the status of <span fg={theme.green}>{currentTask?.title}</span>?
        </text>

        <Select onSelect={onSelect} options={moveOptions} />
      </box>
    </Modal>
  );
}
