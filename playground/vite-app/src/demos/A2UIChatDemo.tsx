/**
 * A2UI Chat Demo
 *
 * Chat interface where users describe UIs in natural language and
 * an LLM renders them as live Tale UI components via A2UI protocol.
 * Supports Anthropic and OpenAI providers.
 */

import * as React from 'react';
import { A2UIProvider, A2UISurface, useA2UI } from '@tale-ui/a2ui/renderer';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';
import type { A2UIAction } from '@tale-ui/a2ui/types';
import type { Provider } from './chat/types';
import { ChatPanel } from './chat/ChatPanel';
import { useChat } from './chat/use-chat';

class A2UIErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[A2UI ErrorBoundary]', error.message, error.stack, info.componentStack);
  }
  render() {
    if (this.state.error) {
      return React.createElement('pre', {
        style: { color: 'var(--error-70)', background: 'var(--error-10)', padding: '1rem', borderRadius: '8px', fontSize: '12px', whiteSpace: 'pre-wrap' },
      }, `Render error: ${this.state.error.message}\n\n${this.state.error.stack}`);
    }
    return this.props.children;
  }
}

const STORAGE_KEYS = {
  provider: 'tale-ui-a2ui-provider',
  'anthropic': 'tale-ui-a2ui-anthropic-key',
  'openai': 'tale-ui-a2ui-openai-key',
  'straico': 'tale-ui-a2ui-straico-key',
  'ollama': 'tale-ui-a2ui-ollama-key', // unused — ollama needs no key
  'ollama-model': 'tale-ui-a2ui-ollama-model',
} as const;

function getEnvKey(provider: Provider): string {
  if (provider === 'openai') {return import.meta.env.VITE_OPENAI_API_KEY || '';}
  if (provider === 'straico') {return import.meta.env.VITE_STRAICO_API_KEY || '';}
  if (provider === 'ollama') {return 'ollama';} // no real key needed
  return import.meta.env.VITE_ANTHROPIC_API_KEY || '';
}

export default function A2UIChatDemo() {
  const [provider, setProvider] = React.useState<Provider>(
    () => (localStorage.getItem(STORAGE_KEYS.provider) as Provider) || 'straico',
  );
  const [apiKey, setApiKey] = React.useState(
    () => localStorage.getItem(STORAGE_KEYS[provider]) || getEnvKey(provider),
  );
  const [ollamaModel, setOllamaModel] = React.useState(
    () => localStorage.getItem(STORAGE_KEYS['ollama-model']) || 'llama3.2',
  );
  const [actionLog, setActionLog] = React.useState<string[]>([]);

  const actionHandlerRef = React.useRef<(surfaceId: string, action: A2UIAction) => void>(() => {});

  const handleAction = React.useCallback((surfaceId: string, action: A2UIAction) => {
    actionHandlerRef.current(surfaceId, action);
  }, []);

  const handleProviderChange = React.useCallback((p: Provider) => {
    setProvider(p);
    localStorage.setItem(STORAGE_KEYS.provider, p);
    setApiKey(p === 'ollama' ? 'ollama' : (localStorage.getItem(STORAGE_KEYS[p]) || getEnvKey(p)));
  }, []);

  const handleApiKeyChange = React.useCallback((key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem(STORAGE_KEYS[provider], key);
    } else {
      localStorage.removeItem(STORAGE_KEYS[provider]);
    }
  }, [provider]);

  const handleOllamaModelChange = React.useCallback((m: string) => {
    setOllamaModel(m);
    localStorage.setItem(STORAGE_KEYS['ollama-model'], m);
  }, []);

  return (
    <A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
      <ChatDemoInner
        provider={provider}
        apiKey={apiKey}
        ollamaModel={ollamaModel}
        onProviderChange={handleProviderChange}
        onApiKeyChange={handleApiKeyChange}
        onOllamaModelChange={handleOllamaModelChange}
        actionHandlerRef={actionHandlerRef}
        actionLog={actionLog}
        setActionLog={setActionLog}
      />
    </A2UIProvider>
  );
}

function ChatDemoInner({
  provider,
  apiKey,
  ollamaModel,
  onProviderChange,
  onApiKeyChange,
  onOllamaModelChange,
  actionHandlerRef,
  actionLog,
  setActionLog,
}: {
  provider: Provider;
  apiKey: string;
  ollamaModel: string;
  onProviderChange: (p: Provider) => void;
  onApiKeyChange: (key: string) => void;
  onOllamaModelChange: (m: string) => void;
  actionHandlerRef: React.MutableRefObject<(surfaceId: string, action: A2UIAction) => void>;
  actionLog: string[];
  setActionLog: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { processMessages, reset } = useA2UI();

  const chat = useChat({
    apiKey,
    model: provider === 'ollama' ? ollamaModel : undefined,
    provider,
    onA2UIMessages: React.useCallback(
      (msgs) => {
        try {
          console.log('[A2UI] Feeding messages:', msgs.length);
          reset();
          for (const msg of msgs) {
            console.log('[A2UI] Processing:', msg.type, JSON.stringify(msg).slice(0, 100));
            processMessages([msg]);
          }
          console.log('[A2UI] All messages processed');
        } catch (err) {
          console.error('[A2UI] Error processing messages:', err);
        }
      },
      [reset, processMessages],
    ),
  });

  actionHandlerRef.current = (_surfaceId: string, action: A2UIAction) => {
    const entry = `[${new Date().toLocaleTimeString()}] ${action.name}(${JSON.stringify(action.context ?? {})})`;
    setActionLog((prev) => [entry, ...prev].slice(0, 20));
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--space-m)', height: 'calc(100vh - 120px)' }}>
      <ChatPanel
        entries={chat.entries}
        isStreaming={chat.isStreaming}
        error={chat.error}
        onSend={chat.sendMessage}
        onClear={chat.clearHistory}
        provider={provider}
        onProviderChange={onProviderChange}
        apiKey={apiKey}
        onApiKeyChange={onApiKeyChange}
        ollamaModel={ollamaModel}
        onOllamaModelChange={onOllamaModelChange}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-s)', minWidth: 0 }}>
        <div
          style={{
            flex: 1,
            padding: 'var(--space-m)',
            borderRadius: 'var(--radius-l)',
            border: '1px solid var(--neutral-20)',
            background: 'var(--neutral-5)',
            overflowY: 'auto',
          }}
        >
          <A2UIErrorBoundary>
          <A2UISurface
            surfaceId="main"
            fallback={
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--neutral-40)',
                  fontSize: 'var(--text-m-font-size)',
                  textAlign: 'center',
                }}
              >
                Your UI will appear here.
                <br />
                Type a prompt in the chat to get started.
              </div>
            }
          />
          </A2UIErrorBoundary>
        </div>

        <div
          style={{
            height: '120px',
            flexShrink: 0,
            padding: 'var(--space-2xs)',
            borderRadius: 'var(--radius-m)',
            border: '1px solid var(--neutral-18)',
            overflowY: 'auto',
            fontFamily: 'var(--mono-font-family)',
            fontSize: 'var(--text-xs-font-size)',
            color: 'var(--neutral-60)',
          }}
        >
          <div style={{ fontWeight: 500, marginBottom: 'var(--space-4xs)', color: 'var(--neutral-70)' }}>
            Action Log
          </div>
          {actionLog.length === 0 ? (
            <span style={{ color: 'var(--neutral-40)' }}>
              Interact with the rendered UI to see actions here...
            </span>
          ) : (
            actionLog.map((entry, i) => <div key={i}>{entry}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
