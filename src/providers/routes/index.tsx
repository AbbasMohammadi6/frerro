import { createContext, use, useState, type ReactNode } from 'react';

export type Route = {
  name: 'loading',
} | {
  name: 'no-project'
} | {
  name: 'projects',
} | {
  name: 'tasks',
  id: number,
};

const changeRouteContext = createContext<((route: Route) => void) | undefined>(undefined);
const routeContext = createContext<Route | undefined>(undefined);

type Props = {
  children: ReactNode;
}

export function RouteProvider(props: Props) {
  const { children } = props;
  const [route, setRoute] = useState<Route>({ name: 'loading' });

  const changeRoute = (route: Route) => {
    setRoute(route);
  }

  return (
    <changeRouteContext.Provider value={changeRoute}>
      <routeContext.Provider value={route}>
        {children}
      </routeContext.Provider>
    </changeRouteContext.Provider>
  );
}

export function useRoute() {
  const route = use(routeContext);
  if (route === undefined) throw new Error('useRoute must be used within the RouteProvider');
  return route;
}

export function useChangeRoute() {
  const changeRoute = use(changeRouteContext);
  if (changeRoute === undefined) throw new Error('useChangeRoute must be used within the RouteProvider');
  return changeRoute;
}
