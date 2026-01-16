import { Tasks } from './components';
import { TasksProvider } from './provider/tasks';
import { UiProvider } from './provider/tasks-page';

type Props = {
  projectId: number;
}

export default function Page(props: Props) {
  const { projectId } = props;
  return (
    <TasksProvider projectId={projectId}>
      <UiProvider>
        <Tasks projectId={projectId} />
      </UiProvider>
    </TasksProvider>
  );
}
