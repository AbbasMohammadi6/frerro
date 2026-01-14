import { useMemo } from "react";
import { db } from "../utils/db";
import Select from "./select-status";
import { useChangeRoute, type Route } from "../providers/routes";

type Option = { label: Route['name'], value: number };

export default function Collections() {
  const changeRoute = useChangeRoute();
  const collections = useMemo(() =>
    db.query<{ title: string, id: number, category_id: number }, any>('select * from collections').all(),
    []);

  const options = collections.map(({ title, id }) => ({
    label: title,
    value: id,
  }));

  const onSelect = (option: Option | null) => {
    if (option === null) return;
    const { value } = option;
    changeRoute({ name: 'tasks', id: value });
  }

  return (
    <box width={'50%'} height={'50%'} alignItems="center" justifyContent="center">
      <text>Choose a collection</text>
      <Select
        options={options}
        onSelect={onSelect as any /* TODO: fix this */}
      />
    </box>
  );
}
