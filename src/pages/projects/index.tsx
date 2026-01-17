import { Projects } from "./components";
import { AppProvider } from "./providers";
import { CategoiesProvider } from "./providers/categories";

export default function Page() {
  return (
    <CategoiesProvider>
      <AppProvider>
        <Projects />
      </AppProvider>
    </CategoiesProvider>
  );
}
