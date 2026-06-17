export interface RecipeSummary {
  slug: string;
  title: string;
  summary: string;
  file: string;
  path: string;
  category: string;
  components: string[];
  tsxBlockCount: number;
  previewable: boolean;
  modifiedAt: string;
}

interface RecipeListResponse {
  recipes: RecipeSummary[];
}

interface RecipeResponse {
  markdown: string;
  error?: string;
}

export async function apiListRecipes(): Promise<RecipeSummary[]> {
  const res = await fetch('/api/recipes');
  const data = (await res.json()) as RecipeListResponse;
  if (!res.ok) {
    throw new Error('Recipe list failed');
  }
  return data.recipes;
}

export async function apiGetRecipe(slug: string): Promise<string> {
  const res = await fetch(`/api/recipe?slug=${encodeURIComponent(slug)}`);
  const data = (await res.json()) as RecipeResponse;
  if (!res.ok) {
    throw new Error(data.error ?? 'Recipe request failed');
  }
  return data.markdown;
}
