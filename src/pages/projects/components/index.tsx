import { useKeyboard } from "@opentui/react";
import { theme } from "@/theme";
import { CategoryTree } from "./category-tree";
import { db } from "@/utils";
import { UpsertCategoryModal } from "./upsert-category";
import UpsertProejct from "./upsert-project";
import { useAppState, useCategories, useChangeModal, useInvalidateCategories } from "../hooks";

export function Projects() {
  const { currentModal } = useAppState();
  const categories = useCategories();
  const invalidateCategories = useInvalidateCategories();
  const changeModal = useChangeModal();

  useKeyboard((key) => {
    if (currentModal) return;
    if (key.name === 'n') changeModal('newProject');
    if (key.name === 'n' && key.shift) changeModal('newCategory');
    if (key.name === 'm') changeModal('moveProject');
  });

  const closeModal = () => changeModal(null);

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
