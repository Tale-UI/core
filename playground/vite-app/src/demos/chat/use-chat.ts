/**
 * Chat State Hook
 *
 * Manages conversation history, streams LLM responses, parses A2UI
 * messages, and routes actions back as conversation turns.
 */

import * as React from 'react';
import type { A2UIMessage, A2UIAction } from '@tale-ui/a2ui/types';
import type { ChatMessage as APIChatMessage } from './types';
import { parseA2UIResponse } from './parse-a2ui-response';
import { apiA2UIChat, type StudioProvider } from './studio-api';

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
  model?: string;
  provider: StudioProvider;
  straicoApiKey: string;
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

export function useChat({
  model,
  provider,
  straicoApiKey,
  onA2UIMessages,
}: UseChatOptions): UseChatReturn {
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
  const straicoApiKeyRef = React.useRef(straicoApiKey);
  straicoApiKeyRef.current = straicoApiKey;

  const sendMessage = React.useCallback(
    (text: string) => {
      if (!modelRef.current || isStreaming) {return;}
      if (providerRef.current === 'straico' && !straicoApiKeyRef.current.trim()) {
        setError('Enter a Straico API key before generating with Straico.');
        return;
      }

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

      void apiA2UIChat({
        messages: history,
        provider: providerRef.current,
        model: modelRef.current,
        straicoApiKey:
          providerRef.current === 'straico' ? straicoApiKeyRef.current.trim() : undefined,
        signal: abort.signal,
      })
        .then(({ text: fullText, truncated }) => {
          setIsStreaming(false);
          abortRef.current = null;

          const result = parseA2UIResponse(fullText, { truncated });
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
                content: fullText,
                a2uiMessages: result.messages,
                error: result.errors,
              };
            }
            return updated;
          });

          if (result.messages) {
            onA2UIMessagesRef.current(result.messages);
          }
        })
        .catch((err: unknown) => {
          if (err instanceof Error && err.name === 'AbortError') {return;}
          setIsStreaming(false);
          abortRef.current = null;
          setError(err instanceof Error ? err.message : String(err));
        });
    },
    [isStreaming],
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
