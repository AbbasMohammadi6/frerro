import { useState } from 'react';
import { useKeyboard } from '@opentui/react';
import { useAppDispatch, useAppState } from '../providers';
import { theme } from '../theme/theme';

export default function Input() {
  const [todo, setTodo] = useState("")
  const { currentModal } = useAppState();
  const dispatch = useAppDispatch();

  useKeyboard((key) => {
    if (key.name === "escape" && currentModal === 'newTask') dispatch({ type: 'ADD_MODAL', payload: null });
  });

  const handleSubmit = async () => {
    const newTodo = { title: todo, id: Math.random() };
    dispatch({ type: 'ADD_TODO', payload: newTodo });
    setTodo("")
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
