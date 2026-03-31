/**
 * Shared types for LLM streaming clients.
 */

export type Provider = 'anthropic' | 'openai' | 'straico';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamOptions {
  apiKey: string;
  messages: ChatMessage[];
  onChunk: (text: string) => void;
  onComplete: (fullText: string) => void;
  onError: (error: Error) => void;
  signal?: AbortSignal;
}
