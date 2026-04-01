/**
 * OpenAI API Streaming Client
 *
 * Direct fetch to the OpenAI Chat Completions API with SSE streaming.
 * No SDK dependency — just raw fetch with ReadableStream parsing.
 */

import type { StreamOptions } from './types';
import { getSystemPrompt } from './system-prompt';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o';
const MAX_TOKENS = 16384;

/**
 * Stream a completion from the OpenAI Chat Completions API.
 */
export async function streamOpenAICompletion({
  apiKey,
  messages,
  onChunk,
  onComplete,
  onError,
  signal,
}: StreamOptions): Promise<void> {
  let fullText = '';
  let truncated = false;

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
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
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
