/**
 * Chat Panel UI Components
 *
 * Built entirely with Tale UI components (dogfooding the design system).
 */

import * as React from 'react';
import { Button } from '@tale-ui/react/button';
import { Badge } from '@tale-ui/react/badge';
import { Spinner } from '@tale-ui/react/spinner';
import { Text } from '@tale-ui/react/text';
import { Row } from '@tale-ui/react/row';
import { Column } from '@tale-ui/react/column';
import { Card } from '@tale-ui/react/card';
import { TextField } from '@tale-ui/react/text-field';
import { Select } from '@tale-ui/react/select';
import { Banner } from '@tale-ui/react/banner';
import { Separator } from '@tale-ui/react/separator';
import type { StudioModel, StudioProvider, StudioProviderStatus } from './studio-api';
import type { ChatEntry } from './use-chat';

const providerLabels: Record<StudioProvider, string> = {
  claude: 'Claude',
  codex: 'OpenAI (Codex)',
  ollama: 'Ollama',
  straico: 'Straico',
};

/* ─── Chat Message ────────────────────────────────────────────────────────── */

function ChatMessage({ entry }: { entry: ChatEntry }) {
  const isUser = entry.role === 'user';

  if (entry.isAction) {
    return (
      <Row justify="end">
        <Badge variant="neutral" size="sm">
          {entry.content.replace('[Action dispatched] ', '')}
        </Badge>
      </Row>
    );
  }

  return (
    <Column gap="4xs" align={isUser ? 'end' : 'start'}>
      <Text variant="label" size="xs" color="muted">
        {isUser ? 'You' : 'Assistant'}
      </Text>
      <div
        style={{
          maxWidth: '85%',
          padding: 'var(--space-2xs) var(--space-xs)',
          borderRadius: 'var(--radius-m)',
          background: isUser ? 'var(--color-60)' : 'var(--neutral-10)',
          color: isUser ? 'var(--color-60-fg)' : 'var(--neutral-90)',
          fontFamily: !isUser && entry.content.startsWith('[') ? 'var(--mono-font-family)' : 'var(--text-font-family)',
          fontSize: !isUser && entry.content.startsWith('[') ? 'var(--text-xs-font-size)' : 'var(--text-s-font-size)',
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          overflowX: 'auto',
        }}
      >
        {entry.content || (entry.role === 'assistant' ? '...' : '')}
      </div>
      {entry.error && (
        <Banner.Root variant="error" size="sm">
          <Banner.Description>{entry.error}</Banner.Description>
        </Banner.Root>
      )}
      {entry.a2uiMessages && !entry.error && (
        <Badge variant="success" size="sm">
          Rendered ({entry.a2uiMessages.length} messages)
        </Badge>
      )}
    </Column>
  );
}

/* ─── Chat Input ──────────────────────────────────────────────────────────── */

function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [text, setText] = React.useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim() || disabled) {return;}
    onSend(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Row gap="2xs">
        <div style={{ flex: 1 }}>
          <TextField.Root
            aria-label="Chat prompt"
            value={text}
            onChange={setText}
            isDisabled={disabled}
          >
            <TextField.Input placeholder="Describe the UI you want to build..." />
          </TextField.Root>
        </div>
        <Button variant="primary" size="md" type="submit" isDisabled={disabled || !text.trim()}>
          Send
        </Button>
      </Row>
    </form>
  );
}

/* ─── Chat Panel (main export) ────────────────────────────────────────────── */

export interface ChatPanelProps {
  entries: ChatEntry[];
  isStreaming: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onClear: () => void;
  providers: StudioProviderStatus[];
  providerModels: StudioModel[];
  provider: StudioProvider;
  onProviderChange: (provider: StudioProvider) => void;
  modelValue: string;
  selectedModel: StudioModel | null;
  onModelChange: (model: string) => void;
  modelLoading: boolean;
  modelError: string | null;
  straicoApiKey: string;
  onStraicoApiKeyChange: (key: string) => void;
  onRefreshModels: () => void;
}

export function ChatPanel({
  entries,
  isStreaming,
  error,
  onSend,
  onClear,
  providers,
  providerModels,
  provider,
  onProviderChange,
  modelValue,
  selectedModel,
  onModelChange,
  modelLoading,
  modelError,
  straicoApiKey,
  onStraicoApiKeyChange,
  onRefreshModels,
}: ChatPanelProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputDisabled =
    isStreaming ||
    modelLoading ||
    !selectedModel ||
    (provider === 'straico' && !straicoApiKey.trim());

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <Column gap="2xs" style={{ width: '400px', flexShrink: 0, height: '100%' }}>
      {/* Header */}
      <Row justify="between">
        <Text variant="title" size="m">A2UI Chat</Text>
        <Button variant="ghost" size="sm" onPress={onClear} isDisabled={entries.length === 0}>
          Clear
        </Button>
      </Row>

      {/* Provider + model */}
      <Column gap="3xs">
        <Row gap="3xs" align="end">
          <div style={{ flex: 1, minWidth: 0 }}>
            <Select.Root
              selectedKey={provider}
              onSelectionChange={(key) => {
                if (key != null) {
                  onProviderChange(String(key) as StudioProvider);
                }
              }}
              isDisabled={isStreaming}
            >
              <Select.Label>Provider</Select.Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Popover>
                <Select.ListBox>
                  {providers.map((providerStatus) => (
                    <Select.Item key={providerStatus.id} id={providerStatus.id}>
                      {providerLabels[providerStatus.id]} - {providerStatus.detail}
                    </Select.Item>
                  ))}
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          </div>
          <Button
            variant="neutral"
            size="sm"
            onPress={onRefreshModels}
            isDisabled={isStreaming || modelLoading}
          >
            {modelLoading ? <Spinner size="sm" /> : null}
            {provider === 'straico' ? 'Load' : 'Refresh'}
          </Button>
        </Row>

        {provider === 'straico' && (
          <TextField.Root value={straicoApiKey} onChange={onStraicoApiKeyChange}>
            <TextField.Label>Straico API key</TextField.Label>
            <TextField.Input
              placeholder="sk-..."
              type="password"
              style={{ fontFamily: 'var(--mono-font-family)', fontSize: 'var(--text-xs-font-size)' }}
            />
          </TextField.Root>
        )}

        <Select.Root
          selectedKey={modelValue || null}
          placeholder={modelLoading ? 'Loading models...' : 'Select a model...'}
          onSelectionChange={(key) => {
            if (key != null) {
              onModelChange(String(key));
            }
          }}
          isDisabled={isStreaming || modelLoading || providerModels.length === 0}
        >
          <Select.Label>Model</Select.Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Icon />
          </Select.Trigger>
          <Select.Popover>
            <Select.ListBox>
              {providerModels.map((model) => (
                <Select.Item key={model.value} id={model.value}>
                  {model.label}
                </Select.Item>
              ))}
            </Select.ListBox>
          </Select.Popover>
        </Select.Root>
      </Column>

      <Separator />

      {/* Message history */}
      <Card.Root variant="outlined" style={{ flex: 1, minHeight: '300px', overflow: 'hidden' }}>
        <Card.Body style={{ height: '100%', overflow: 'hidden' }}>
          <div ref={scrollRef} style={{ height: '100%', overflowY: 'auto' }}>
            <Column gap="xs">
              {entries.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--space-xl) var(--space-m)',
                    textAlign: 'center',
                  }}
                >
                  <Text variant="text" size="s" color="muted">
                    Describe any UI and it will be rendered using Tale UI components.
                    Try: &quot;Create a user profile card with avatar, name, and a follow button&quot;
                  </Text>
                </div>
              ) : (
                entries.map((entry) => <ChatMessage key={entry.id} entry={entry} />)
              )}
              {isStreaming && (
                <Row gap="3xs" align="center">
                  <Spinner size="sm" />
                  <Text variant="text" size="xs" color="muted">Generating UI...</Text>
                </Row>
              )}
            </Column>
          </div>
        </Card.Body>
      </Card.Root>

      {/* Error display */}
      {error && (
        <Banner.Root variant="error" size="sm">
          <Banner.Description>{error}</Banner.Description>
        </Banner.Root>
      )}

      {modelError && (
        <Banner.Root variant="warning" size="sm">
          <Banner.Description>{modelError}</Banner.Description>
        </Banner.Root>
      )}

      {/* Input */}
      <ChatInput onSend={onSend} disabled={inputDisabled} />
    </Column>
  );
}
