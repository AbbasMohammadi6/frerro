import { useState } from 'react';
import { theme } from './theme';
import { useAppDispatch, useAppState } from './providers';
import { writeFileSync } from "fs"
import { join } from "path"

const TASKS_LOG_PATH = join(import.meta.dir, ".", "tasks.json")

export default function Input() {
  const [todo, setTodo] = useState("")
  const { focusedArea, tasks } = useAppState();
  const dispatch = useAppDispatch();
  const focused = focusedArea === "input";

  const handleSubmit = async () => {
    const newTodo = { title: todo, id: Math.random() };
    dispatch({ type: 'ADD_TODO', payload: newTodo });
    const newTasks = { ...tasks, todo: tasks.todo.concat(newTodo) };

    writeFileSync(TASKS_LOG_PATH, JSON.stringify(newTasks))

    setTodo("")
  }

  const borderColor = focused ? theme.info_yellow : undefined;

  return (
    <box title="Todo" border width='100%' height={3} borderColor={borderColor}>
      <input
        placeholder="Enter todo..."
        value={todo}
        onInput={setTodo}
        onSubmit={handleSubmit}
        focused={focused}
      />
    </box>
  )
}
