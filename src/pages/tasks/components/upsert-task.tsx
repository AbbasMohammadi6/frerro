import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { Modal } from '@/components';
import { theme } from '@/theme';

export type Task = { title: string, description?: string };

type Props = {
  close: () => void;
  currentTask?: Task;
  submitTask: ({ title, description }: Task) => void;
}

export function UpsertTaskModal(props: Props) {
  const { close, submitTask, currentTask } = props;
  const [title, setTitle] = useState(currentTask?.title ?? "");
  const [description, setDescription] = useState(currentTask?.description ?? "");
  const [focused, setFocused] = useState<'title' | 'description'>("title");

  useKeyboard((key) => {
    if (key.name === "escape") close();
    if (key.name === 'tab') setFocused(prev => prev === 'title' ? 'description' : 'title');
    if (key.name === 'return') {
      if (!title) return;
      submitTask({ title, description });
      setTitle("");
      setDescription("");
      setFocused('title');
    }
  });

  return (
    <Modal>
      <box
        border
        width='100%'
        height={'auto'}
        borderColor={theme.cyan}
        title={`${currentTask ? 'Edit your task...' : 'Enter your new task...'}`}
      >
        <box borderColor={theme.gray}>
          <input
            height={1}
            value={title}
            onInput={setTitle}
            placeholder='Title'
            focused={focused === 'title'}
            backgroundColor={theme.bg}
          />
        </box>

        <box borderColor={theme.gray}>
          <input
            height={1}
            value={description}
            onInput={setDescription}
            placeholder='Description'
            focused={focused === 'description'}
          />
        </box>
      </box>
    </Modal>
  );
}
