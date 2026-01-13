import { useState, type ComponentProps } from "react";
import type { Status, Task } from "../providers/types";
import { theme } from "../theme/theme";
import { logToFile } from "../utils/logger";
import { Modal } from "./modal";
import Select from "./select-status";
import { db, reverseStatus, status as statusMap } from "../utils/db";
import { useInvalidate } from "../providers/tasks";
import { useKeyboard } from "@opentui/react"
import { useAppDispatch, useAppState } from "../providers";

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
  const { currentModal } = useAppState();
  const dispatch = useAppDispatch();
  const moveOptions = defaultMoveOptions.filter(o => o.value !== status);
  const invalidateTasks = useInvalidate();

  useKeyboard((key) => {
    if (currentModal !== 'moveTask') return;

    if (key.name === 'escape') {
      dispatch({ type: 'ADD_MODAL', payload: null });
    }
  });

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
