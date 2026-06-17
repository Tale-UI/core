import type { ChatMessage } from './types';

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

export async function apiA2UIChat({
  messages,
  provider,
  model,
  straicoApiKey,
  signal,
}: {
  messages: ChatMessage[];
  provider: StudioProvider;
  model?: string;
  straicoApiKey?: string;
  signal?: AbortSignal;
}): Promise<{ text: string; truncated: boolean }> {
  const res = await fetch('/api/a2ui/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      provider,
      model,
      straicoApiKey,
    }),
    signal,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? 'A2UI chat generation failed');
  }
  return {
    text: data.text as string,
    truncated: Boolean(data.truncated),
  };
}
