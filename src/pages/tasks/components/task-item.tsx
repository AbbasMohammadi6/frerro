import { useState } from "react";
import type { Task } from "../provider/tasks/types";
import { useAppState } from "../provider/tasks-page";
import { theme } from "@/theme";
import { useKeyboard } from '@opentui/react';

type Props = {
  isActive: boolean;
  task: Task;
}

export function TaskItem(props: Props) {
  const { isActive, task: { title, description } } = props;
  const [isOpen, setIsOpen] = useState(false);
  const { currentModal } = useAppState();

  useKeyboard((key) => {
    if (currentModal) return;
    if (key.name === 'return' && isActive && description) setIsOpen(prev => !prev);
  });

  return (
    <box>
      <text
        fg={isActive ? theme.light_blue : undefined}
      >
        {isOpen ? '▼ ' : isActive ? "▶ " : "• "}{title}
      </text>
      {isOpen && <text paddingBottom={1} fg={theme.gray}>{description}</text>}
    </box>
  );
}
