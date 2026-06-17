/**
 * A2UI Chat Demo
 *
 * Chat interface where users describe UIs in natural language and
 * an LLM renders them as live Tale UI components via A2UI protocol.
 * Uses the same provider/model discovery path as MCP Studio.
 */

import * as React from 'react';
import { A2UIProvider, A2UISurface, useA2UI } from '@tale-ui/a2ui/renderer';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';
import type { A2UIAction } from '@tale-ui/a2ui/types';
import { ChatPanel } from './chat/ChatPanel';
import {
  apiModels,
  type StudioModel,
  type StudioProvider,
  type StudioProviderStatus,
} from './chat/studio-api';
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
  provider: 'tale-ui:a2ui-chat:provider',
  model: 'tale-ui:a2ui-chat:model',
  straicoApiKey: 'tale-ui:a2ui-chat:straico-api-key',
} as const;

const LEGACY_STRAICO_API_KEY_STORAGE_KEY = 'tale-ui-a2ui-straico-key';
const LEGACY_PROVIDER_STORAGE_KEY = 'tale-ui-a2ui-provider';
const LEGACY_OLLAMA_MODEL_STORAGE_KEY = 'tale-ui-a2ui-ollama-model';
const DEFAULT_PROVIDER_VALUE: StudioProvider = 'claude';
const DEFAULT_MODEL_VALUE = 'claude:sonnet';
const PROVIDER_VALUES = ['claude', 'codex', 'ollama', 'straico'] as const;

function isStudioProvider(value: string | null): value is StudioProvider {
  return PROVIDER_VALUES.includes(value as StudioProvider);
}

function readStoredString(storageKey: string): string {
  try {
    return window.localStorage.getItem(storageKey) ?? '';
  } catch {
    return '';
  }
}

function writeStoredString(storageKey: string, value: string): void {
  try {
    if (value) {
      window.localStorage.setItem(storageKey, value);
    } else {
      window.localStorage.removeItem(storageKey);
    }
  } catch {
    /* localStorage may be unavailable in private contexts */
  }
}

function readStoredProvider(): StudioProvider {
  const value = readStoredString(STORAGE_KEYS.provider) || readStoredString(LEGACY_PROVIDER_STORAGE_KEY);
  return isStudioProvider(value) ? value : DEFAULT_PROVIDER_VALUE;
}

function readStoredModel(): string {
  const value = readStoredString(STORAGE_KEYS.model);
  if (value) {
    return value;
  }
  const legacyProvider = readStoredString(LEGACY_PROVIDER_STORAGE_KEY);
  const legacyOllamaModel = readStoredString(LEGACY_OLLAMA_MODEL_STORAGE_KEY);
  if (legacyProvider === 'ollama' && legacyOllamaModel) {
    return `ollama:${legacyOllamaModel}`;
  }
  return DEFAULT_MODEL_VALUE;
}

function readStoredStraicoApiKey(): string {
  return (
    readStoredString(STORAGE_KEYS.straicoApiKey) ||
    readStoredString(LEGACY_STRAICO_API_KEY_STORAGE_KEY) ||
    import.meta.env.VITE_STRAICO_API_KEY ||
    ''
  );
}

function formatModelErrors(errors: Partial<Record<StudioProvider, string>>): string | null {
  const messages = Object.entries(errors).map(([provider, message]) => `${provider}: ${message}`);
  return messages.length > 0 ? messages.join(' / ') : null;
}

export default function A2UIChatDemo() {
  const [providers, setProviders] = React.useState<StudioProviderStatus[]>([]);
  const [models, setModels] = React.useState<StudioModel[]>([]);
  const [provider, setProvider] = React.useState<StudioProvider>(readStoredProvider);
  const [modelValue, setModelValue] = React.useState(readStoredModel);
  const [modelLoading, setModelLoading] = React.useState(false);
  const [modelError, setModelError] = React.useState<string | null>(null);
  const [straicoApiKey, setStraicoApiKey] = React.useState(readStoredStraicoApiKey);
  const [actionLog, setActionLog] = React.useState<string[]>([]);

  const actionHandlerRef = React.useRef<(surfaceId: string, action: A2UIAction) => void>(() => {});
  const initialStraicoApiKey = React.useRef(straicoApiKey);
  const providerRef = React.useRef(provider);

  const handleAction = React.useCallback((surfaceId: string, action: A2UIAction) => {
    actionHandlerRef.current(surfaceId, action);
  }, []);

  React.useEffect(() => {
    providerRef.current = provider;
  }, [provider]);

  const loadModels = React.useCallback(async (apiKey: string) => {
    setModelLoading(true);
    setModelError(null);
    try {
      const currentProvider = providerRef.current;
      const result = await apiModels({ straicoApiKey: apiKey.trim() || undefined });
      setProviders(result.providers);
      setModels(result.models);
      setProvider((current) =>
        result.providers.some((providerStatus) => providerStatus.id === current)
          ? current
          : DEFAULT_PROVIDER_VALUE,
      );
      setModelValue((current) => {
        if (
          result.models.some(
            (model) => model.value === current && model.provider === currentProvider,
          )
        ) {
          return current;
        }
        const firstProviderModel = result.models.find(
          (model) => model.provider === currentProvider,
        );
        if (firstProviderModel) {
          return firstProviderModel.value;
        }
        if (result.models.some((model) => model.value === DEFAULT_MODEL_VALUE)) {
          return DEFAULT_MODEL_VALUE;
        }
        return result.models[0]?.value ?? '';
      });
      setModelError(formatModelErrors(result.errors));
    } catch (err) {
      setModelError(err instanceof Error ? err.message : String(err));
    } finally {
      setModelLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadModels(initialStraicoApiKey.current);
  }, [loadModels]);

  React.useEffect(() => {
    writeStoredString(STORAGE_KEYS.provider, provider);
  }, [provider]);

  React.useEffect(() => {
    writeStoredString(STORAGE_KEYS.model, modelValue);
  }, [modelValue]);

  React.useEffect(() => {
    writeStoredString(
      STORAGE_KEYS.straicoApiKey,
      straicoApiKey.trim() ? straicoApiKey : '',
    );
  }, [straicoApiKey]);

  const providerModels = React.useMemo(
    () => models.filter((model) => model.provider === provider),
    [models, provider],
  );

  const selectedModel = React.useMemo(
    () => providerModels.find((model) => model.value === modelValue) ?? null,
    [providerModels, modelValue],
  );

  const handleProviderChange = React.useCallback(
    (nextProvider: StudioProvider) => {
      setProvider(nextProvider);
      const firstProviderModel = models.find((model) => model.provider === nextProvider);
      setModelValue(firstProviderModel?.value ?? '');
    },
    [models],
  );

  return (
    <A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
      <ChatDemoInner
        providers={providers}
        providerModels={providerModels}
        provider={provider}
        modelValue={modelValue}
        selectedModel={selectedModel}
        modelLoading={modelLoading}
        modelError={modelError}
        straicoApiKey={straicoApiKey}
        onProviderChange={handleProviderChange}
        onModelChange={setModelValue}
        onStraicoApiKeyChange={setStraicoApiKey}
        onRefreshModels={() => void loadModels(straicoApiKey)}
        actionHandlerRef={actionHandlerRef}
        actionLog={actionLog}
        setActionLog={setActionLog}
      />
    </A2UIProvider>
  );
}

function ChatDemoInner({
  providers,
  providerModels,
  provider,
  modelValue,
  selectedModel,
  modelLoading,
  modelError,
  straicoApiKey,
  onProviderChange,
  onModelChange,
  onStraicoApiKeyChange,
  onRefreshModels,
  actionHandlerRef,
  actionLog,
  setActionLog,
}: {
  providers: StudioProviderStatus[];
  providerModels: StudioModel[];
  provider: StudioProvider;
  modelValue: string;
  selectedModel: StudioModel | null;
  modelLoading: boolean;
  modelError: string | null;
  straicoApiKey: string;
  onProviderChange: (p: StudioProvider) => void;
  onModelChange: (model: string) => void;
  onStraicoApiKeyChange: (key: string) => void;
  onRefreshModels: () => void;
  actionHandlerRef: React.MutableRefObject<(surfaceId: string, action: A2UIAction) => void>;
  actionLog: string[];
  setActionLog: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { processMessages, reset } = useA2UI();

  const chat = useChat({
    model: selectedModel?.id,
    provider,
    straicoApiKey,
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
        providers={providers}
        providerModels={providerModels}
        provider={provider}
        onProviderChange={onProviderChange}
        modelValue={modelValue}
        selectedModel={selectedModel}
        onModelChange={onModelChange}
        modelLoading={modelLoading}
        modelError={modelError}
        straicoApiKey={straicoApiKey}
        onStraicoApiKeyChange={onStraicoApiKeyChange}
        onRefreshModels={onRefreshModels}
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
