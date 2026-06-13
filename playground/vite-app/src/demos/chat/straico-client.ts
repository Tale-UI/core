/**
 * Straico API Client
 *
 * Direct fetch to the Straico Chat Completions API.
 * Straico uses an OpenAI-compatible format but does NOT support streaming.
 * The full response is returned at once.
 */

import type { StreamOptions } from './types';
import { getSystemPrompt } from './system-prompt';

// Use Vite dev proxy to bypass CORS (Straico doesn't set CORS headers)
const API_URL = import.meta.env.DEV
  ? '/api/straico/v0/chat/completions'
  : 'https://api.straico.com/v0/chat/completions';
const MODEL = 'anthropic/claude-sonnet-4';
const MAX_TOKENS = 16384;

/**
 * Fetch a completion from the Straico API (non-streaming).
 * Delivers the full text at once via onChunk + onComplete.
 */
export async function fetchStraicoCompletion({
  apiKey,
  messages,
  onChunk,
  onComplete,
  onError,
  signal,
}: StreamOptions): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: 'system', content: getSystemPrompt() },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
      signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Straico API error (${response.status}): ${errorBody}`);
    }

    const json = await response.json();

    // Straico wraps the OpenAI-compatible response inside data.completion
    // Python SDK: reply["completion"]["choices"][0]["message"]["content"]
    const completion = json.data?.completion ?? json.completion ?? json;
    const choice = completion?.choices?.[0];
    const content = choice?.message?.content ?? '';
    const truncated = choice?.finish_reason === 'length';

    if (!content) {
      throw new Error(`Straico returned an empty response. Raw: ${JSON.stringify(json).slice(0, 200)}`);
    }

    onChunk(content);
    onComplete(content, { truncated });
  } catch (err) {
    if ((err as Error).name === 'AbortError') {return;}
    onError(err as Error);
  }
}
