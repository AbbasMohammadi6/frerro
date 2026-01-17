import { useState } from "react";
import { theme } from "@/theme";
import { useKeyboard } from "@opentui/react";
import { useChangeRoute } from "@/providers/routes";
import { SelectStatus, type Option } from "@/components";
import type { NormalizedCategory } from "../providers/categories/types";
import { useAppState } from "../providers/project-page/project-page";
import { MoveProject } from "./move-project";
import { UpsertCategoryModal } from "./upsert-category";
import { db } from "@/utils/db";
import { useInvalidateCategories } from "../providers/categories";
import { RemoveItemModal } from "@/components/remove-item-modal";
import UpsertProject from "./upsert-project";
import { useChangeModal } from "../providers/project-page/actions";

type Props = {
  categories: NormalizedCategory[];
}

export function CategoryTree(props: Props) {
  const { categories } = props;
  const changeRoute = useChangeRoute();
  const { currentModal } = useAppState();
  const invalidateCategories = useInvalidateCategories();
  const changeModal = useChangeModal();
  const [currentProject, setCurrentProject] = useState<Option | null>(null);
  const [currentCategory, setCurrentCategory] = useState<NormalizedCategory | null>(categories[0] ?? null);
  const [focusedCategory, setFocusedCategory] = useState<NormalizedCategory | null>(null);

  const onSelect = (option: Option | null) => {
    if (option === null) return;
    const { value } = option;
    if (typeof value === 'number') changeRoute({ name: 'tasks', id: value });
  }

  const closeModal = () => changeModal(null);

  const submitEditCategory = (value: string) => {
    if (!currentCategory) return;
    db.run('UPDATE categories SET title = ? WHERE ID = ?', [value, currentCategory?.id]);
    invalidateCategories();
    closeModal();
    setCurrentCategory(null); // TODO: save the new category in the state and test it
  }

  useKeyboard((key) => {
    if (currentModal) return;

    if (key.name === 'return') {
      setFocusedCategory(currentCategory);
    }

    if (key.name === 'escape') {
      setFocusedCategory(null);
      setCurrentProject(null);
    }

    if (key.name === '-') {
      if (focusedCategory) changeModal('removeProject');
      else if (categories.length > 1) changeModal('removeCategory');

      invalidateCategories();
    }

    if (key.name === 'e') {
      if (focusedCategory && currentProject) changeModal('editProject');
      else if (categories.length > 1) changeModal('editCategory');

      invalidateCategories();
    }

    if (key.name === 'j' && focusedCategory === null) {
      const firstCategory = categories.at(0);
      if (currentCategory === null && firstCategory) return void setCurrentCategory(firstCategory);

      const currentIdx = categories.findIndex(c => c.id === currentCategory?.id);
      const nextOption = categories[currentIdx + 1];
      if (currentIdx !== -1 && nextOption !== undefined) {
        setCurrentCategory(nextOption);
      }
    }

    if (key.name === 'k' && focusedCategory === null) {
      if (categories[0] === undefined) return;

      const currentIdx = categories.findIndex(c => c.id === currentCategory?.id);
      const prevOption = categories[currentIdx - 1];
      if (currentIdx !== -1 && prevOption !== undefined) {
        setCurrentCategory(prevOption);
      }
    }
  });

  const onChange = (option: Option | null) => setCurrentProject(option);

  const unfocusCurrentCategory = () => {
    const firstCategory = categories.at(0);
    if (firstCategory) setCurrentCategory(firstCategory);
  }

  const submitRemoveProject = () => {
    if (!currentProject) return;
    db.run('DELETE FROM tasks WHERE project_id IS ?', [currentProject.value]);
    db.run('DELETE FROM projects WHERE id IS ?', [currentProject.value]);
    onChange(null);
    invalidateCategories();
    closeModal();
  }

  const submitRemoveCategory = () => {
    if (!currentCategory) return;
    db.run('DELETE FROM projects WHERE category_id IS ?', [currentCategory.id]);
    db.run('DELETE FROM categories WHERE id IS ?', [currentCategory.id]);
    unfocusCurrentCategory();
    invalidateCategories();
    closeModal();
  }

  return (
    <>
      <box width={'100%'} height={'100%'} position="relative">
        <box position="absolute" top={'25%'} left={'40%'} /* TODO: find better values for these */>
          <text marginBottom={0.5} fg={theme.cyan}>Choose a Project</text>
          {categories.map(({ projects, title, id }) => {
            const isSelected = currentCategory?.id === id;
            const isFocused = focusedCategory?.id === id;
            return (
              <box key={id}>
                <text fg={isSelected ? theme.light_gray : theme.gray}>
                  {isFocused ? '▼ ' : isSelected ? "▶ " : "• "}
                  {' '}{title}
                </text>
                {isFocused && (projects.length ?
                  <box marginLeft={2}>
                    <SelectStatus
                      focused={!currentModal}
                      value={currentProject}
                      onChange={onChange}
                      currentModal={currentModal}
                      onSelect={onSelect as any /* TODO: fix this */}
                      options={projects.map(item => ({ label: item.title, value: item.id }))}
                    />
                  </box>
                  :
                  <text fg={theme.gray} marginLeft={2}>---</text>
                )}
              </box>
            )
          })}
        </box>
      </box>

      {currentProject && (
        <>
          {currentModal === 'moveProject' &&
            <MoveProject currentProjectId={currentProject.value as number /* TODO: find a better way to do this */} />}

          {currentModal === 'removeProject' &&
            <RemoveItemModal
              type='project'
              close={closeModal}
              name={currentProject.label}
              submitRemove={submitRemoveProject}
            />}
        </>
      )}

      {currentCategory && currentProject && currentModal === 'editProject' &&
        <UpsertProject
          resetState={() => {
            closeModal();
            setCurrentProject(null);
          }}
          initialProject={{ title: currentProject.label, projectId: currentProject.value as number, categoryId: currentCategory?.id }}
        />
      }

      {currentCategory && (
        <>
          {currentModal === 'editCategory' &&
            <UpsertCategoryModal onSubmit={submitEditCategory} initialValue={currentCategory.title} />}

          {currentModal === 'removeCategory' &&
            <RemoveItemModal
              type="category"
              close={closeModal}
              name={currentCategory.title}
              submitRemove={submitRemoveCategory}
            />}
        </>
      )}

    </>
  );
}
