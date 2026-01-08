import { useReducer } from "react"
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

type Action =
  | { type: 'SELECT_FIRST'; todos: Todo[] }
  | { type: 'SELECT_NEXT'; todos: Todo[] }
  | { type: 'SELECT_PREV'; todos: Todo[] }
  | { type: 'DESELECT' }

const reducer = (state: number | null, action: Action): number | null => {
  switch (action.type) {
    case 'SELECT_FIRST':
      return action.todos[0]?.id || null
    case 'SELECT_NEXT':
      const currentIndex = action.todos.findIndex(todo => todo.id === state)
      if (currentIndex >= 0 && currentIndex < action.todos.length - 1) {
        return action.todos[currentIndex + 1].id
      }
      return state
    case 'SELECT_PREV':
      const prevIndex = action.todos.findIndex(todo => todo.id === state)
      if (prevIndex > 0) {
        return action.todos[prevIndex - 1].id
      }
      return state
    case 'DESELECT':
      return null
    default:
      return state
  }
}

export function Column({ title, status, todos, focused, onMoveTodo }: ColumnProps) {
  const [focusedTodoId, dispatch] = useReducer(reducer, null)

  useKeyboard((key) => {
    if (!focused) return

    logToFile(`key.name is  ${key.name}`);
    if (key.name === "return") {
      dispatch({ type: 'SELECT_FIRST', todos: todos[status] })
    }

    if (focusedTodoId) {
      const currentIndex = todos[status].findIndex(todo => todo.id === focusedTodoId)

      if (key.name === "down") {
        dispatch({ type: 'SELECT_NEXT', todos: todos[status] })
      }

      if (key.name === "up") {
        dispatch({ type: 'SELECT_PREV', todos: todos[status] })
      }

      if (key.name === "escape") {
        dispatch({ type: 'DESELECT' })
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




