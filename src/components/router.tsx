import type { ReactNode } from "react";
import { useRoute } from "../providers/routes";
import Loading from "./loading";
import { Tasks } from "./tasks";
import Collections from "./collections";
import NoCollection from "./no-collection";
import { TasksProvider } from "../providers/tasks";

export default function Router(): ReactNode {
  const route = useRoute();

  switch (route.name) {
    case 'loading': return <Loading />;
    // passing id as a prop, because it is the only way I could think of to make typescript understand that id is not undefined here
    case 'tasks': return (
      <TasksProvider collectionId={route.id}>
        <Tasks id={route.id} />
      </TasksProvider>
    );
    case 'collections': return <Collections />;
    case 'no-collection': return <NoCollection />;
  }
}
