import { useKeyboard } from "@opentui/react"
import { Column } from "./column"
import type { TodosByStatus } from "./column"
import Input from "./input";
import { useAppDispatch, useAppState } from "./providers";
import type { State } from "./types";

export function App() {
  const dispatch = useAppDispatch();
  const { focusedArea } = useAppState();

  useKeyboard((key) => {
    if (key.name === "tab") {
      const areas: State['focusedArea'][] = ["input", "todo", "doing", "done", "wont-do"]
      const currentIndex = areas.indexOf(focusedArea)
      const nextIndex = (currentIndex + 1) % areas.length
      const nextArea = areas[nextIndex]
      if (nextArea) {
        dispatch({ type: 'FOCUS_AREA', payload: nextArea });
      }
    }
  });

  const handleMoveTodo = (todoId: number, fromStatus: keyof TodosByStatus, toStatus: keyof TodosByStatus) => {
    // setTodos(prev => {
    //   const updatedTodos = { ...prev }
    //   const todoIndex = updatedTodos[fromStatus].findIndex(todo => todo.id === todoId)
    //
    //   if (todoIndex !== -1) {
    //     const movedTodo = updatedTodos[fromStatus][todoIndex]
    //     if (movedTodo) {
    //       updatedTodos[fromStatus] = updatedTodos[fromStatus].filter(todo => todo.id !== todoId)
    //       updatedTodos[toStatus] = [...updatedTodos[toStatus], movedTodo]
    //       logToFile(`Successfully moved todo ${todoId} from ${fromStatus} to ${toStatus}`)
    //     }
    //   } else {
    //     logToFile(`Failed to find todo ${todoId} in ${fromStatus}`)
    //   }
    //
    //   return updatedTodos
    // })
  }

  return (
    <box>
      <box flexDirection={'row'} padding={1} gap={1} height='100%'>
        <Column
          title="Todo"
          status="todo"
          onMoveTodo={handleMoveTodo}
        />

        <Column
          title="Doing"
          status="doing"
          onMoveTodo={handleMoveTodo}
        />

        <Column
          title="Done"
          status="done"
          onMoveTodo={handleMoveTodo}
        />

        <Column
          title="Won't Do"
          status="wont-do"
          onMoveTodo={handleMoveTodo}
        />
      </box>

      <Input />
    </box>
  )
}
