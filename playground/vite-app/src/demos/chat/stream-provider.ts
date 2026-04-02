/**
 * Provider Dispatcher
 *
 * Routes streaming requests to the correct LLM client.
 */

import type { Provider, StreamOptions } from './types';
import { streamAnthropicCompletion } from './anthropic-client';
import { streamOpenAICompletion } from './openai-client';
import { fetchStraicoCompletion } from './straico-client';
import { streamOllamaCompletion } from './ollama-client';

export function streamCompletion(provider: Provider, options: StreamOptions): Promise<void> {
  switch (provider) {
    case 'openai':
      return streamOpenAICompletion(options);
    case 'straico':
      return fetchStraicoCompletion(options);
    case 'ollama':
      return streamOllamaCompletion(options);
    case 'anthropic':
    default:
      return streamAnthropicCompletion(options);
  }
}
