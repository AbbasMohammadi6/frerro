import { useMemo } from "react";
import { useChangeRoute } from "../providers/routes";
import { db } from "../utils/db";

export default function Loading() {
  const changeRoute = useChangeRoute();
  const collections = useMemo(() => db.query('SELECT * FROM collections').all(), []);

  if (collections.length) changeRoute({ name: 'collections' });
  else changeRoute({ name: 'no-collection' });

  return null;
}
