import { createCliRenderer } from "@opentui/core"
import { createRoot } from "@opentui/react"
import { App } from "./components/app"
import { Provider } from "./providers"

const renderer = await createCliRenderer()

createRoot(renderer).render(
  <Provider>
    <App />
  </Provider>
)
