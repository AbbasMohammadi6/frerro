import { createCliRenderer } from "@opentui/core"
import { createRoot } from "@opentui/react"
import Router from "./router"
import { RouteProvider } from "./providers/routes";

const renderer = await createCliRenderer()

createRoot(renderer).render(
  <RouteProvider>
    <Router />
  </RouteProvider>
);
