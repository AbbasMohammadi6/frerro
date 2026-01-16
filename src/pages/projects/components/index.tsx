import { useKeyboard } from "@opentui/react";
import { useCategories, useInvalidateCategories } from "../providers/categories";
import { useProjectUiDispatch, useProjectUiState } from "../providers/project-page/project-page";
import { theme } from "@/theme";
import { CategoryTree } from "./category-tree";
import { db } from "@/utils/db";
import { UpsertItemModal } from "@/components/upsert-item-modal";

export function Projects() {
  const { currentModal } = useProjectUiState();
  const dispatch = useProjectUiDispatch();
  const categories = useCategories();
  const invalidateCategories = useInvalidateCategories();

  useKeyboard((key) => {
    if (currentModal) return;
    if (key.name === 'n') dispatch({ type: 'CHANGE_MODAL', payload: 'newProject' });
    if (key.name === 'n' && key.shift) dispatch({ type: 'CHANGE_MODAL', payload: 'newCategory' });
    if (key.name === 'm') dispatch({ type: 'CHANGE_MODAL', payload: 'moveCategory' });
  });

  const closeModal = () => dispatch({ type: 'CHANGE_MODAL', payload: null });

  const submitCategory = (value: string) => {
    db.run('INSERT INTO categories (title) VALUES (?)', [value]);
    invalidateCategories();
    closeModal();
  }

  const submitProject = (value: string) => {
    db.run('INSERT INTO projects (title, category_id) VALUES (?, 1)', [value]);
    invalidateCategories();
    closeModal();
  }

  return (
    <box backgroundColor={currentModal ? theme.popup_back : theme.bg}>
      <CategoryTree categories={categories} />
      {currentModal === 'newCategory' && (
        <UpsertItemModal
          close={closeModal}
          entityName="category"
          onSubmit={submitCategory}
        />)}
      {currentModal === 'newProject' && (
        <UpsertItemModal
          close={closeModal}
          entityName="project"
          onSubmit={submitProject}
        />)}
    </box>
  );
}
