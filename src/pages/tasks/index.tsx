import { Tasks } from './components';
import { TasksProvider } from './provider/tasks';
import { AppProvider } from './provider/app';

type Props = {
  projectId: number;
}

export default function Page(props: Props) {
  const { projectId } = props;
  return (
    <TasksProvider projectId={projectId}>
      <AppProvider>
        <Tasks projectId={projectId} />
      </AppProvider>
    </TasksProvider>
  );
}
