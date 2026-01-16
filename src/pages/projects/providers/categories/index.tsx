import { createContext, use, useState, type ReactNode } from 'react';
import type { Category, NormalizedCategory } from './types';
import { db } from '@/utils/db';

function getCateories(): NormalizedCategory[] {
  const dbCategories = db.query<Category, []>(
    `SELECT p.title as projectTitle, c.title as categoryTitle, c.id as categoryId, p.id as projectId 
     FROM categories c
     LEFT JOIN projects p
     ON p.category_id = c.id`
  ).all();

  const projects = dbCategories.reduce((acc, cat) => {
    acc[cat.categoryId] = (acc[cat.categoryId] ?? []).concat(
      cat.projectId === null ? [] : { id: cat.projectId, title: cat.projectTitle }
    );
    return acc;
  }, {} as Record<number, { title: string, id: number }[]>);

  const categories = dbCategories.reduce((acc, { categoryId, categoryTitle }) => {
    if (acc[categoryId]) return acc;
    acc[categoryId] = { title: categoryTitle, id: categoryId, projects: projects[categoryId] ?? [] };
    return acc;
  }, {} as Record<number, NormalizedCategory>);

  return Object.values(categories);
}

const invalidateCategoriesContext = createContext<(() => void) | undefined>(undefined);
const categoriesContext = createContext<NormalizedCategory[] | undefined>(undefined);

type Props = {
  children: ReactNode;
}

export function CategoiesProvider(props: Props) {
  const { children } = props;
  const [categories, setCategories] = useState(getCateories);

  const invalidate = () => {
    const updatedTasks = getCateories();
    setCategories(updatedTasks);
  }

  return (
    <invalidateCategoriesContext.Provider value={invalidate}>
      <categoriesContext.Provider value={categories}>
        {children}
      </categoriesContext.Provider>
    </invalidateCategoriesContext.Provider>
  );
}

export function useCategories() {
  const tasks = use(categoriesContext);
  if (tasks === undefined) throw new Error('useCategories must be used within the CategoriesProvider');
  return tasks;
}

export function useInvalidateCategories() {
  const invalidate = use(invalidateCategoriesContext);
  if (invalidate === undefined) throw new Error('useInvalidateCategories must be used within the CategoriesProvider');
  return invalidate;
}
