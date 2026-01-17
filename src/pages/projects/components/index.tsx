import { useKeyboard } from "@opentui/react";
import { useCategories, useInvalidateCategories } from "../providers/categories";
import { useProjectUiDispatch, useProjectUiState } from "../providers/project-page/project-page";
import { theme } from "@/theme";
import { CategoryTree } from "./category-tree";
import { db } from "@/utils/db";
import { UpsertCategoryModal } from "./upsert-category";
import UpsertProejct from "./upsert-project";

export function Projects() {
  const { currentModal } = useProjectUiState();
  const dispatch = useProjectUiDispatch();
  const categories = useCategories();
  const invalidateCategories = useInvalidateCategories();

  useKeyboard((key) => {
    if (currentModal) return;
    if (key.name === 'n') dispatch({ type: 'CHANGE_MODAL', payload: 'newProject' });
    if (key.name === 'n' && key.shift) dispatch({ type: 'CHANGE_MODAL', payload: 'newCategory' });
    if (key.name === 'm') dispatch({ type: 'CHANGE_MODAL', payload: 'moveProject' });
  });

  const closeModal = () => dispatch({ type: 'CHANGE_MODAL', payload: null });

  const submitCategory = (value: string) => {
    db.run('INSERT INTO categories (title) VALUES (?)', [value]);
    invalidateCategories();
    closeModal();
  }

  useKeyboard((key) => {
    if (key.name === 'escape') closeModal();
  });

  return (
    <box backgroundColor={currentModal ? theme.popup_back : theme.bg}>
      <CategoryTree categories={categories} />
      {currentModal === 'newCategory' && <UpsertCategoryModal onSubmit={submitCategory} />}
      {currentModal === 'newProject' && <UpsertProejct resetState={closeModal} />}
    </box>
  );
}
