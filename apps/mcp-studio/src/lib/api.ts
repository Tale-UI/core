// Typed fetch wrappers for the Studio's /api/* routes.

export async function apiPlanUi(prompt: string): Promise<string> {
  const res = await fetch('/api/mcp/plan_ui', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? 'plan_ui failed');
  }
  return data.text as string;
}

export async function apiGetComponent(name: string): Promise<unknown> {
  const res = await fetch(`/api/mcp/get_component?name=${encodeURIComponent(name)}`);
  const data = await res.json();
  if (data.isError) {
    throw new Error(data.text);
  }
  return JSON.parse(data.text as string);
}

export async function apiListComponents(): Promise<ComponentSummary[]> {
  const res = await fetch('/api/mcp/list_components');
  const data = await res.json();
  return JSON.parse(data.text as string) as ComponentSummary[];
}

export async function apiListRecipes(): Promise<RecipeSummary[]> {
  const res = await fetch('/api/mcp/list_recipes');
  const data = await res.json();
  return JSON.parse(data.text as string) as RecipeSummary[];
}

export async function apiGetRecipe(slug: string): Promise<string> {
  const res = await fetch(`/api/mcp/get_recipe?slug=${encodeURIComponent(slug)}`);
  const data = await res.json();
  if (data.isError) {
    throw new Error(data.text);
  }
  return data.text as string;
}

export interface GoldenPrompt {
  slug: string;
  prompt: string;
  difficulty: string;
}

export async function apiGoldenPrompts(): Promise<GoldenPrompt[]> {
  const res = await fetch('/api/golden-prompts');
  if (!res.ok) {
    return [];
  }
  return res.json() as Promise<GoldenPrompt[]>;
}

export type StudioProvider = 'claude' | 'codex' | 'ollama' | 'straico';

export interface StudioProviderStatus {
  id: StudioProvider;
  label: string;
  available: boolean;
  detail: string;
  requiresApiKey?: boolean;
}

export interface StudioModel {
  provider: StudioProvider;
  id: string;
  label: string;
  value: string;
  source: string;
}

export interface StudioModelsResponse {
  providers: StudioProviderStatus[];
  models: StudioModel[];
  errors: Partial<Record<StudioProvider, string>>;
}

export async function apiModels(
  opts: { straicoApiKey?: string } = {},
): Promise<StudioModelsResponse> {
  const hasStraicoKey = Boolean(opts.straicoApiKey?.trim());
  const res = await fetch('/api/models', {
    method: hasStraicoKey ? 'POST' : 'GET',
    headers: hasStraicoKey ? { 'Content-Type': 'application/json' } : undefined,
    body: hasStraicoKey ? JSON.stringify({ straicoApiKey: opts.straicoApiKey }) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? 'models failed');
  }
  return data as StudioModelsResponse;
}

export async function apiGenerate(
  prompt: string,
  opts: {
    provider?: StudioProvider;
    model?: string;
    maxTurns?: number;
    straicoApiKey?: string;
  } = {},
): Promise<string> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, ...opts }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? 'generate failed');
  }
  return data.text as string;
}

export interface WritePitfallArgs {
  component: string;
  slug: string;
  summary: string;
  detail?: string;
  antiPattern: string;
  fix: string;
  completeExample?: string;
}

export interface WritePitfallResult {
  ok?: boolean;
  block?: string;
  error?: string;
  rolledBack?: boolean;
}

export async function apiWritePitfall(args: WritePitfallArgs): Promise<WritePitfallResult> {
  const res = await fetch('/api/write-pitfall', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  return (await res.json()) as WritePitfallResult;
}

export interface ComponentSummary {
  name: string;
  import: string;
  category: string;
  description: string;
  kind: string;
  status: string;
}

export interface RecipeSummary {
  slug: string;
  title: string;
  file: string;
}
