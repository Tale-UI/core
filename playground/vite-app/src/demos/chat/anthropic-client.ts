/**
 * Anthropic API Streaming Client
 *
 * Direct fetch to the Anthropic Messages API with SSE streaming.
 * No SDK dependency — just raw fetch with ReadableStream parsing.
 */

import type { StreamOptions } from './types';
import { getSystemPrompt } from './system-prompt';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';
const MAX_TOKENS = 16384;

/**
 * Stream a completion from the Anthropic Messages API.
 */
export async function streamAnthropicCompletion({
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
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: getSystemPrompt(),
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {throw new Error('No response body');}

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {break;}

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) {continue;}
        const data = line.slice(6).trim();
        if (data === '[DONE]') {continue;}

        try {
          const event = JSON.parse(data);
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            fullText += event.delta.text;
            onChunk(event.delta.text);
          }
          if (event.type === 'message_delta' && event.delta?.stop_reason === 'max_tokens') {
            truncated = true;
          }
          if (event.type === 'message_stop') {break;}
        } catch {
          // Ignore malformed SSE lines
        }
      }
    }

    onComplete(fullText, { truncated });
  } catch (err) {
    if ((err as Error).name === 'AbortError') {return;}
    onError(err as Error);
  }
}
