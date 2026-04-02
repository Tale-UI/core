/**
 * Ollama Streaming Client
 *
 * Uses Ollama's OpenAI-compatible endpoint for streaming completions.
 * No API key required — auth header is sent as a dummy value.
 * Default base URL: http://localhost:11434/v1
 */

import type { StreamOptions } from './types';
import { getSystemPrompt } from './system-prompt';

const BASE_URL = 'http://localhost:11434/v1';
const MAX_TOKENS = 16384;

/**
 * Stream a completion from a locally running Ollama instance.
 * `options.model` is required — it should be the Ollama model name (e.g. 'llama3.2', 'qwen2.5-coder').
 */
export async function streamOllamaCompletion({
  model,
  messages,
  onChunk,
  onComplete,
  onError,
  signal,
}: StreamOptions): Promise<void> {
  if (!model) {
    onError(new Error('Ollama requires a model name. Enter the model name in the Model field.'));
    return;
  }

  let fullText = '';
  let truncated = false;

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ollama',
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        messages: [
          { role: 'system', content: getSystemPrompt() },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      if (response.status === 0 || errorBody === '') {
        throw new Error(`Cannot connect to Ollama at ${BASE_URL}. Is Ollama running?`);
      }
      throw new Error(`Ollama error (${response.status}): ${errorBody}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') continue;

        try {
          const event = JSON.parse(data);
          const choice = event.choices?.[0];
          const content = choice?.delta?.content;
          if (typeof content === 'string') {
            fullText += content;
            onChunk(content);
          }
          if (choice?.finish_reason === 'length') {
            truncated = true;
          }
        } catch {
          // Ignore malformed SSE lines
        }
      }
    }

    onComplete(fullText, { truncated });
  } catch (err) {
    if ((err as Error).name === 'AbortError') return;
    onError(err as Error);
  }
}
