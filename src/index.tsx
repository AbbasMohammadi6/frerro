import { createCliRenderer } from "@opentui/core"
import { useState, useCallback } from "react"
import initialTodos from './todos.json';
import { createRoot, useKeyboard } from "@opentui/react"
import { Column } from "./column"
import type { TodosByStatus } from "./column"
import { logToFile } from "./logger"

type FocusedArea = "input" | "todo" | "doing" | "done" | "wont-do"
const mainColor = "yellow";
const secondaryColor = "#6a5acd";

function App() {
  const [todos, setTodos] = useState<TodosByStatus>(initialTodos);
  const [todo, setTodo] = useState("")
  const [focused, setFocused] = useState<FocusedArea>("input")

  useKeyboard((key) => {
    if (key.name === "tab") {
      const areas: FocusedArea[] = ["input", "todo", "doing", "done", "wont-do"]
      const currentIndex = areas.indexOf(focused)
      const nextIndex = (currentIndex + 1) % areas.length
      const nextArea = areas[nextIndex]
      if (nextArea) {
        setFocused(nextArea)
      }
    }
  });

  const handleSubmit = useCallback(() => {
    setTodos(prev => ({
      ...prev,
      todo: [...prev.todo, {
        title: todo,
        id: Math.max(...Object.values(prev).flat().map(t => t.id)) + 1,
      }]
    }));
    setTodo("");
  }, [todo, todos])

  const handleMoveTodo = useCallback((todoId: number, fromStatus: keyof TodosByStatus, toStatus: keyof TodosByStatus) => {
    setTodos(prev => {
      const updatedTodos = { ...prev }
      const todoIndex = updatedTodos[fromStatus].findIndex(todo => todo.id === todoId)
      
      if (todoIndex !== -1) {
        const movedTodo = updatedTodos[fromStatus][todoIndex]
        if (movedTodo) {
          updatedTodos[fromStatus] = updatedTodos[fromStatus].filter(todo => todo.id !== todoId)
          updatedTodos[toStatus] = [...updatedTodos[toStatus], movedTodo]
          logToFile(`Successfully moved todo ${todoId} from ${fromStatus} to ${toStatus}`)
        }
      } else {
        logToFile(`Failed to find todo ${todoId} in ${fromStatus}`)
      }
      
      return updatedTodos
    })
  }, [])

  return (
    <box>
      <box flexDirection={'row'} padding={1} gap={1} height={'100%'}>
        <Column 
          title="Todo" 
          status="todo" 
          todos={todos} 
          focused={focused === "todo"} 
          onMoveTodo={handleMoveTodo}
        />
        
        <Column 
          title="Doing" 
          status="doing" 
          todos={todos} 
          focused={focused === "doing"} 
          onMoveTodo={handleMoveTodo}
        />
        
        <Column 
          title="Done" 
          status="done" 
          todos={todos} 
          focused={focused === "done"} 
          onMoveTodo={handleMoveTodo}
        />
        
        <Column 
          title="Won't Do" 
          status="wont-do" 
          todos={todos} 
          focused={focused === "wont-do"} 
          onMoveTodo={handleMoveTodo}
        />
      </box>

      <box title="Todo" border width={40} height={3} borderColor={focused === "input" ? "yellow" : undefined}>
        <input
          placeholder="Enter todo..."
          value={todo}
          onInput={setTodo}
          onSubmit={handleSubmit}
          focused={focused === "input"}
        />
      </box>
    </box>
  )
}

const renderer = await createCliRenderer()
createRoot(renderer).render(<App />)
