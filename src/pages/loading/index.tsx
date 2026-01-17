import { db } from "@/utils";
import { useMemo } from "react";
import { useChangeRoute } from "@/providers/routes";

export function Loading() {
  const changeRoute = useChangeRoute();
  const projects = useMemo(() => db.query('SELECT * FROM projects').all(), []);

  if (projects.length) changeRoute({ name: 'projects' });
  else changeRoute({ name: 'no-project' });

  return null;
}
