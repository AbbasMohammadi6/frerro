import { useChangeRoute } from "@/providers/routes";
import { theme } from "@/theme";
import { db, rootCategoryName } from "@/utils/db";
import { logToFile } from "@/utils/logger";

export default function Wellcome() {
  const changeRoute = useChangeRoute();

  const onSubmit = (value: string) => {
    if (!value) return;
    try {
      const rootCategory = db.query<{ id: number }, any>(`SELECT id FROM categories WHERE title = ?`).get(rootCategoryName);
      if (rootCategory) {
        db.run('INSERT INTO projects (title, category_id) VALUES (?, ?)', [value, rootCategory.id]);
      }

      changeRoute({ name: 'projects' });
    }
    catch (e) {
      logToFile('there was an error' + JSON.stringify(e));
    }
  }

  return (
    <box alignItems="center" justifyContent="center">
      <box alignItems="center" width={'50%'} height={'50%'} >
        <text>There are not projects, create one?</text>
        <box borderColor={theme.yellow} width={'100%'}>
          <input placeholder="Project Name..." onSubmit={onSubmit} focused={true} height={1} />
        </box>
      </box>
    </box>
  );
}
