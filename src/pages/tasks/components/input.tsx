import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { useAppDispatch, useAppState } from '../provider/tasks-page';
import { useInvalidateTasks } from '../provider/tasks';
import { db } from '@/utils/db';
import { theme } from '@/theme';

export function Input() {
  const [todo, setTodo] = useState("")
  const { currentModal } = useAppState();
  const dispatch = useAppDispatch();
  const invalidateTasks = useInvalidateTasks();

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
      borderColor={theme.cyan}
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
