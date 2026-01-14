import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { useAppDispatch, useAppState } from '../providers';
import { theme } from '../theme/theme';
import { db } from '../utils/db';
import { useInvalidate } from '../providers/tasks';
import { Modal } from './modal';

type Props = {
  collectionId: number;
}

export default function EnterModal(props: Props) {
  const { collectionId } = props;
  const { currentModal } = useAppState();
  const dispatch = useAppDispatch();
  const invalidateTasks = useInvalidate();
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [focused, setFocused] = useState<'title' | 'description'>("title")

  useKeyboard((key) => {
    if (currentModal !== 'newTask') return;

    if (key.name === "escape") dispatch({ type: 'ADD_MODAL', payload: null });

    if (key.name === 'tab') setFocused(prev => prev === 'title' ? 'description' : 'title');

    if (key.name === 'return') {
      db.run(
        'INSERT INTO TASKS (title, status, description, collection_id) VALUES (?, 1, ?, ?)',
        [title, description, collectionId]
      );
      setTitle("");
      setDescription("");
      setFocused('title');
      invalidateTasks();
    }
  });

  return (
    <Modal>
      <box
        border
        width='100%'
        height={'auto'}
        borderColor={theme.cyan}
        title='Enter your new task...'
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
  )
}
