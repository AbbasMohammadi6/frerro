import { Projects } from "./components";
import { CategoiesProvider } from "./providers/categories";
import { ProjectUiProvider } from "./providers/project-page/project-page";

export default function Page() {
  return (
    <CategoiesProvider>
      <ProjectUiProvider>
        <Projects />
      </ProjectUiProvider>
    </CategoiesProvider>
  );
}
