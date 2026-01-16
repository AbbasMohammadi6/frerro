import type { ReactNode } from "react";
import { useRoute } from "../providers/routes";
import Tasks from "@/pages/tasks";
import Projects from "@/pages/projects";
import Wellcome from '@/pages/welcome';
import { Loading } from "@/pages/loading";

export default function Router(): ReactNode {
  const route = useRoute();

  switch (route.name) {
    case 'loading': return <Loading />;
    // passing id as a prop, because it is the only way I could think of to make typescript understand that id is not undefined here
    case 'tasks': return <Tasks projectId={route.id} />;
    case 'projects': return <Projects />;
    case 'no-project': return <Wellcome />;
  }
}
