import { createCliRenderer } from "@opentui/core"
import { createRoot } from "@opentui/react"
import { UiProvider } from "./providers"
import { RouteProvider } from "./providers/routes"
import Router from "./components/router"

const renderer = await createCliRenderer()

createRoot(renderer).render(
  <UiProvider>
    <RouteProvider>
      <Router />
    </RouteProvider>
  </UiProvider>
);
