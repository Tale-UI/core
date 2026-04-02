/**
 * Shared types for LLM streaming clients.
 */

export type Provider = 'anthropic' | 'openai' | 'straico' | 'ollama';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CompletionMeta {
  truncated: boolean;
}

export interface StreamOptions {
  apiKey: string;
  model?: string;
  messages: ChatMessage[];
  onChunk: (text: string) => void;
  onComplete: (fullText: string, meta: CompletionMeta) => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}
