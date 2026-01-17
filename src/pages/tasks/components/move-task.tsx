import { useState, type ComponentProps } from "react";
import { useKeyboard } from "@opentui/react"
import type { Status, Task } from "../provider/tasks/types";
import { Modal, type Option } from "@/components";
import { useAppState } from "../provider/tasks-page";
import { useInvalidateTasks } from "../provider/tasks";
import { SelectStatus } from '@/components/select-status';
import { db, status as statusMap } from "@/utils/db";
import { theme } from "@/theme";
import { useChangeModal } from "../provider/tasks-page/actions";

type Props = {
  currentTask: Task;
  status: Status;
}

const defaultMoveOptions: Array<Option> = [
  { label: "Todo", value: 'todo' },
  { label: 'Doing', value: 'doing' },
  { label: 'Done', value: 'done' },
  { label: "Wont' Do", value: 'wont-do' },
];

export function MoveModal(props: Props) {
  const { currentTask, status } = props;
  const { currentModal } = useAppState();
  const moveOptions = defaultMoveOptions.filter(o => o.value !== status);
  const invalidateTasks = useInvalidateTasks();
  const [value, setValue] = useState<Option | null>(null);
  const changeModal = useChangeModal();

  useKeyboard((key) => {
    if (currentModal !== 'moveTask') return;
    if (key.name === 'escape') changeModal(null);
  });

  const onSelect: ComponentProps<typeof SelectStatus>['onSelect'] = (option) => {
    if (option === null) return;
    db.run('UPDATE tasks SET status = ? WHERE ID = ?', [(statusMap)[option.value as Status], currentTask.id]);
    invalidateTasks();
    changeModal(null);
  }

  const onChange = (option: Option) => setValue(option);

  return (
    <Modal>
      <box borderColor={theme.cyan} title="Move Task...">
        <text>
          Changing the status of <span fg={theme.green}>{currentTask?.title}</span>?
        </text>

        <SelectStatus
          focused
          value={value}
          onSelect={onSelect}
          options={moveOptions}
          currentModal={currentModal}
          onChange={onChange as any /* TODO: fix this */}
        />
      </box>
    </Modal>
  );
}
