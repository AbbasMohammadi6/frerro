import { useState } from "react"
import { useKeyboard } from "@opentui/react"
import { logToFile } from "./logger"

interface Todo {
  id: number
  title: string
}

interface TodosByStatus {
  todo: Todo[]
  doing: Todo[]
  done: Todo[]
  "wont-do": Todo[]
}

interface ColumnProps {
  title: string
  status: keyof TodosByStatus
  todos: TodosByStatus
  focused: boolean
  onMoveTodo: (todoId: number, fromStatus: keyof TodosByStatus, toStatus: keyof TodosByStatus) => void;
}

export function Column({ title, status, todos, focused, onMoveTodo }: ColumnProps) {
  const [focusedTodoId, setFocusedTodoId] = useState<number | null>(null)

  useKeyboard((key) => {
    if (!focused) return

    logToFile(`key.name is  ${key.name}`);
    if (key.name === "return") {
      const firstTodo = todos[status][0]
      if (firstTodo) {
        setFocusedTodoId(firstTodo.id)
      }
    }

    if (focusedTodoId) {
      const currentIndex = todos[status].findIndex(todo => todo.id === focusedTodoId)

      if (key.name === "down" && currentIndex >= 0 && currentIndex < todos[status].length - 1) {
        const nextTodo = todos[status][currentIndex + 1]
        if (nextTodo) {
          setFocusedTodoId(nextTodo.id)
        }
      }

      if (key.name === "up" && currentIndex > 0) {
        const prevTodo = todos[status][currentIndex - 1]
        if (prevTodo) {
          setFocusedTodoId(prevTodo.id)
        }
      }

      if (key.name === "escape") {
        setFocusedTodoId(null)
      }

      if (key.name === "left" && onMoveTodo) {
        const statusOrder: (keyof TodosByStatus)[] = ["todo", "doing", "done", "wont-do"]
        const currentStatusIndex = statusOrder.indexOf(status)

        if (currentStatusIndex > 0) {
          const prevStatus = statusOrder[currentStatusIndex - 1]
          if (prevStatus) {
            logToFile(`Moving todo ${focusedTodoId} from ${status} to ${prevStatus}`)
            onMoveTodo(focusedTodoId, status, prevStatus)
          }
        }
      }

      if (key.name === "right" && onMoveTodo) {
        const statusOrder: (keyof TodosByStatus)[] = ["todo", "doing", "done", "wont-do"]
        const currentStatusIndex = statusOrder.indexOf(status)

        logToFile(`key is right and the currentStatusIndex is ${currentStatusIndex}`);

        if (currentStatusIndex < 4) {
          const nextStatus = statusOrder[currentStatusIndex + 1]
          if (nextStatus) {
            logToFile(`Moving todo ${focusedTodoId} from ${status} to ${nextStatus}`)
            onMoveTodo(focusedTodoId, status, nextStatus)
          }
        }
      }

    }
  })

  return (
    <box title={title} border flexGrow={1} borderColor={focusedTodoId ? "skyblue" : focused ? "yellow" : undefined}>
      {todos[status].map(todo => (
        <text
          key={todo.id}
          fg={focusedTodoId === todo.id ? "skyblue" : undefined}
        >
          {focusedTodoId === todo.id ? "▶ " : "• "}{todo.title}
        </text>
      ))}
    </box>
  )
}

export type { Todo, TodosByStatus }




