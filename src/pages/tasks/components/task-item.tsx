import { useEffect, useState } from "react";
import { theme } from "@/theme";
import { useKeyboard } from '@opentui/react';
import type { Task } from "../types";
import { useAppState } from "../hooks";

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
    if (key.name === 'return' && isActive) setIsOpen(prev => !prev);
  });

  useEffect(() => {
    if (!isActive) setIsOpen(false);
  }, [isActive]);

  return (
    <box>
      <text fg={isActive ? theme.light_blue : undefined}>
        {isOpen ? '▼ ' : isActive ? "▶ " : "• "}{title}
      </text>
      {isOpen && (
        description?.length
          ? <text paddingBottom={1} marginLeft={1} fg={theme.gray}>{description}</text>
          : <text fg={theme.gray} marginLeft={2}>---</text>
      )}
    </box>
  );
}
