import { useKeyboard } from "@opentui/react"
import { useAppState } from "./providers"
import { useReducer } from "react"
import { theme } from "./theme"
import type { Task } from "./types"
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
  onMoveTodo: (todoId: number, fromStatus: keyof TodosByStatus, toStatus: keyof TodosByStatus) => void;
}

type Action =
  | { type: 'SELECT'; payload: Task['id'] }
  // | { type: 'SELECT_NEXT'; todos: Todo[] }
  // | { type: 'SELECT_PREV'; todos: Todo[] }
  | {
    type: 'DESELECT'
  }

const reducer = (state: number | null, action: Action): number | null => {
  switch (action.type) {
    case 'SELECT':
      return action.payload;

    // case 'SELECT_NEXT':
    //   const currentIndex = action.todos.findIndex(todo => todo.id === state)
    //   if (currentIndex >= 0 && currentIndex < action.todos.length - 1) {
    //     const nextTodo = action.todos[currentIndex + 1]
    //     return nextTodo?.id || state
    //   }
    //   return state
    //
    // case 'SELECT_PREV':
    //   const prevIndex = action.todos.findIndex(todo => todo.id === state)
    //   if (prevIndex > 0) {
    //     const prevTodo = action.todos[prevIndex - 1]
    //     return prevTodo?.id || state
    //   }
    //   return state

    case 'DESELECT':
      return null

    default:
      return state
  }
}

export function Column({ title, status, onMoveTodo }: ColumnProps) {
  const [focusedTodoId, dispatch] = useReducer(reducer, null)
  const { tasks, focusedArea } = useAppState();
  const focused = focusedArea === status;
  const selected = focusedTodoId !== null;
  const columnTasks = tasks[status];

  useKeyboard((key) => {
    if (!focused) return

    // logToFile(key.name);
    logToFile(`${key.name} + ${key.ctrl}`);

    if (key.name === "return") {
      const firstTask = columnTasks[0];
      if (firstTask) {
        dispatch({ type: 'SELECT', payload: firstTask.id });
      }
    }

    if (key.name === "tab") {
      dispatch({ type: 'DESELECT' });
    }

    if (focusedTodoId) {
      const currentIndex = columnTasks.findIndex(todo => todo.id === focusedTodoId)

      if (key.name === "down") {
        const nextTodo = columnTasks.at(currentIndex + 1);
        if (nextTodo) dispatch({ type: 'SELECT', payload: nextTodo.id })
      }

      if (key.name === "up") {
        const prevTodo = columnTasks.at(currentIndex - 1);
        if (prevTodo) dispatch({ type: 'SELECT', payload: prevTodo.id })
      }

      if (key.name === "escape") {
        dispatch({ type: 'DESELECT' })
      }

      if (key.name === "-") {
        dispatch({ type: 'DESELECT' })
      }

      //   if (key.name === "left" && onMoveTodo) {
      //     const statusOrder: (keyof TodosByStatus)[] = ["todo", "doing", "done", "wont-do"]
      //     const currentStatusIndex = statusOrder.indexOf(status)
      //
      //     if (currentStatusIndex > 0) {
      //       const prevStatus = statusOrder[currentStatusIndex - 1]
      //       if (prevStatus) {
      //         logToFile(`Moving todo ${focusedTodoId} from ${status} to ${prevStatus}`)
      //         onMoveTodo(focusedTodoId, status, prevStatus)
      //       }
      //     }
      //   }
      //
      //   if (key.name === "right" && onMoveTodo) {
      //     const statusOrder: (keyof TodosByStatus)[] = ["todo", "doing", "done", "wont-do"]
      //     const currentStatusIndex = statusOrder.indexOf(status)
      //
      //     logToFile(`key is right and the currentStatusIndex is ${currentStatusIndex}`);
      //
      //     if (currentStatusIndex < 4) {
      //       const nextStatus = statusOrder[currentStatusIndex + 1]
      //       if (nextStatus) {
      //         logToFile(`Moving todo ${focusedTodoId} from ${status} to ${nextStatus}`)
      //         onMoveTodo(focusedTodoId, status, nextStatus)
      //       }
      //     }
      //   }
      //
    }
  })

  const borderColor = selected ? theme.light_blue : focused ? theme.info_yellow : undefined;

  return (
    <box title={title} border flexGrow={1} /* flexShrink={0} */ borderColor={borderColor}>
      {tasks[status].map(todo => (
        <text
          key={todo.id}
          fg={focusedTodoId === todo.id ? theme.light_blue : undefined}
        >
          {focusedTodoId === todo.id ? "▶ " : "• "}{todo.title}
        </text>
      ))}
    </box>
  )
}

export type { Todo, TodosByStatus }




