export type DbCategory = {
  id: number,
  title: string;
}

export type DbProject = {
  id: number;
  title: string;
  category_id: number;
}

export type NormalizedCategory = {
  id: number,
  title: string;
  projects: {
    id: number;
    title: string;
  }[];
};

export type Category = { projectTitle: string, categoryTitle: string, categoryId: number, projectId: number };
