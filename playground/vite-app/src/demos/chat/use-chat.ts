/**
 * Chat State Hook
 *
 * Manages conversation history, streams LLM responses, parses A2UI
 * messages, and routes actions back as conversation turns.
 */

import * as React from 'react';
import type { A2UIMessage, A2UIAction } from '@tale-ui/a2ui/types';
import type { Provider, ChatMessage as APIChatMessage } from './types';
import { streamCompletion } from './stream-provider';
import { parseA2UIResponse } from './parse-a2ui-response';

export interface ChatEntry {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isAction?: boolean;
  a2uiMessages?: A2UIMessage[] | null;
  error?: string | null;
  timestamp: number;
}

interface UseChatOptions {
  apiKey: string;
  model?: string;
  provider: Provider;
  onA2UIMessages: (msgs: A2UIMessage[]) => void;
}

interface UseChatReturn {
  entries: ChatEntry[];
  isStreaming: boolean;
  error: string | null;
  sendMessage: (text: string) => void;
  sendAction: (surfaceId: string, action: A2UIAction) => void;
  clearHistory: () => void;
}

function genId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChat({ apiKey, model, provider, onA2UIMessages }: UseChatOptions): UseChatReturn {
  const [entries, setEntries] = React.useState<ChatEntry[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  const entriesRef = React.useRef(entries);
  entriesRef.current = entries;
  const onA2UIMessagesRef = React.useRef(onA2UIMessages);
  onA2UIMessagesRef.current = onA2UIMessages;
  const providerRef = React.useRef(provider);
  providerRef.current = provider;
  const modelRef = React.useRef(model);
  modelRef.current = model;

  const sendMessage = React.useCallback(
    (text: string) => {
      if (!apiKey || isStreaming) {return;}

      const userEntry: ChatEntry = {
        id: genId(),
        role: 'user',
        content: text,
        timestamp: Date.now(),
      };

      const assistantEntry: ChatEntry = {
        id: genId(),
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };

      setEntries((prev) => [...prev, userEntry, assistantEntry]);
      setIsStreaming(true);
      setError(null);

      const history: APIChatMessage[] = [
        ...entriesRef.current
          .filter((entry) => entry.content.length > 0)
          .map((entry) => ({ role: entry.role, content: entry.content })),
        { role: 'user' as const, content: text },
      ];

      const abort = new AbortController();
      abortRef.current = abort;

      streamCompletion(providerRef.current, {
        apiKey,
        model: modelRef.current,
        messages: history,
        signal: abort.signal,
        onChunk: (chunk) => {
          setEntries((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'assistant') {
              updated[updated.length - 1] = { ...last, content: last.content + chunk };
            }
            return updated;
          });
        },
        onComplete: (fullText, meta) => {
          setIsStreaming(false);
          abortRef.current = null;

          const result = parseA2UIResponse(fullText, { truncated: meta.truncated });
          console.log('[A2UI Chat] Parse result:', result.errors ? 'ERRORS' : 'OK', result.messages?.length ?? 0, 'messages');
          if (result.messages) {
            for (const msg of result.messages) {
              console.log('[A2UI Chat] Message:', msg.type, 'surfaceId' in msg ? (msg as any).surfaceId : '');
            }
          }

          setEntries((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === 'assistant') {
              updated[updated.length - 1] = {
                ...last,
                a2uiMessages: result.messages,
                error: result.errors,
              };
            }
            return updated;
          });

          if (result.messages) {
            onA2UIMessagesRef.current(result.messages);
          }
        },
        onError: (err) => {
          setIsStreaming(false);
          abortRef.current = null;
          setError(err.message);
        },
      });
    },
    [apiKey, isStreaming],
  );

  const sendAction = React.useCallback(
    (surfaceId: string, action: A2UIAction) => {
      const actionText = `[Action dispatched] surfaceId="${surfaceId}" name="${action.name}" context=${JSON.stringify(action.context ?? {})}`;

      setEntries((prev) => [
        ...prev,
        {
          id: genId(),
          role: 'user',
          content: actionText,
          isAction: true,
          timestamp: Date.now(),
        },
      ]);

      setTimeout(() => sendMessage(actionText), 0);
    },
    [sendMessage],
  );

  const clearHistory = React.useCallback(() => {
    if (abortRef.current) {abortRef.current.abort();}
    setEntries([]);
    setIsStreaming(false);
    setError(null);
  }, []);

  return { entries, isStreaming, error, sendMessage, sendAction, clearHistory };
}
