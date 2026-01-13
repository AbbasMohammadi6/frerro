import { createCliRenderer } from "@opentui/core"
import { createRoot } from "@opentui/react"
import { App } from "./components/app"
import { Provider } from "./providers"
import { TasksProvider } from "./providers/tasks"

const renderer = await createCliRenderer()

createRoot(renderer).render(
  <TasksProvider>
    <Provider>
      <App />
    </Provider>
  </TasksProvider>
)
