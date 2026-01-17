import { Modal, SelectStatus, type Option } from "@/components";
import { theme } from "@/theme";
import { db } from "@/utils/db";
import { useEffect, useMemo, useState } from "react";
import type { DbCategory } from "../providers/categories/types";
import { useKeyboard } from "@opentui/react";
import { useInvalidateCategories } from "../providers/categories";

type Props = {
  initialProject?: { title: string, categoryId: number, projectId: number };
  resetState: () => void;
}

export default function UpsertProejct(props: Props) {
  const { initialProject, resetState } = props;
  const [title, setTitle] = useState(initialProject?.title ?? '');
  const [categoryId, setCategoryId] = useState<number | null>(initialProject?.categoryId ?? null);
  const [focused, setFocused] = useState<'input' | 'select'>('input');
  const invalidateCategories = useInvalidateCategories();

  const categories = useMemo(() => db.query<DbCategory, []>('SELECT * FROM categories').all(), []);
  const categoryOptions: Option[] = categories.map(({ title, id }) => ({ value: id, label: title }));
  const currentCategory = categoryOptions.find(({ value }) => value === categoryId) ?? null;

  useKeyboard((key) => {
    if (key.name === 'return') {
      if (categoryId === null) return;

      if (initialProject)
        db.run<[string, number, number]>(
          'UPDATE projects SET title = ?, category_id = ? WHERE id = ?', [title, categoryId, initialProject.projectId]
        );

      else db.run<[string, number]>('INSERT INTO projects (title, category_id) VALUES (?, ?)', [title, categoryId]);

      invalidateCategories();
      resetState();
    }

    if (key.name === 'tab') {
      setFocused(prev => prev === 'input' ? 'select' : 'input');
    }
  });

  useEffect(() => {
    if (focused === 'select' && currentCategory === null) {
      const firstCategoryId = categoryOptions.at(0)?.value as undefined | number; // TODO: find a better way for this
      setCategoryId(firstCategoryId ?? null);
    }
  }, [focused]);

  return (
    <Modal>
      <box
        border
        width='100%'
        height={'auto'}
        borderColor={theme.cyan}
        title={`${initialProject ? 'Edit your project...' : 'Create a new project...'}`}
      >
        <box borderColor={focused === 'input' ? theme.info_yellow : theme.gray} title='Project name' marginBottom={1}>
          <input
            height={1}
            value={title}
            onInput={setTitle}
            focused={focused === 'input'}
            backgroundColor={theme.bg}
          />
        </box>

        <SelectStatus
          title='Select the category'
          currentModal={false}
          value={currentCategory}
          onSelect={() => void 0}
          options={categoryOptions}
          focused={focused === 'select'}
          borderColor={focused === 'select' ? theme.info_yellow : theme.gray}
          onChange={({ value }) => setCategoryId(value as number /* TODO: find a better way to do this */)}
        />
      </box>
    </Modal>
  );
}
