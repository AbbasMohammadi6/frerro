import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { useAppDispatch, useAppState } from '../providers';
import { theme } from '../theme/theme';
import { db } from '../utils/db';
import { useInvalidate } from '../providers/tasks';

export default function Input() {
  const [todo, setTodo] = useState("")
  const { currentModal } = useAppState();
  const dispatch = useAppDispatch();
  const invalidateTasks = useInvalidate();

  useKeyboard((key) => {
    if (key.name === "escape" && currentModal === 'newTask') dispatch({ type: 'ADD_MODAL', payload: null });
  });

  const handleSubmit = async () => {
    db.run('INSERT INTO TASKS (title, status) VALUES (?, 1)', [todo]);
    setTodo("")
    invalidateTasks();
  }

  return (
    <box
      border
      width='100%'
      height={3}
      borderColor={theme.info_yellow}
      title='Enter your new task...'
    >
      <input
        value={todo}
        onInput={setTodo}
        onSubmit={handleSubmit}
        focused={true}
      />
    </box>
  )
}
