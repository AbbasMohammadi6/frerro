import { db } from '@/utils/db';
import { theme } from '@/theme';
import { useState } from 'react';
import { useInvalidateTasks } from '../provider/tasks';

export function Input() {
  const [todo, setTodo] = useState("")
  const invalidateTasks = useInvalidateTasks();

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
