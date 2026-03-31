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
import { SelectNative } from '@tale-ui/react/select-native';
import { Banner } from '@tale-ui/react/banner';
import { Separator } from '@tale-ui/react/separator';
import type { Provider } from './types';
import type { ChatEntry } from './use-chat';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
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
  provider: Provider;
  onProviderChange: (provider: Provider) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function ChatPanel({
  entries,
  isStreaming,
  error,
  onSend,
  onClear,
  provider,
  onProviderChange,
  apiKey,
  onApiKeyChange,
}: ChatPanelProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

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

      {/* Provider + API Key */}
      <Row gap="3xs">
        <SelectNative
          aria-label="Provider"
          value={provider}
          onChange={(e) => onProviderChange(e.target.value as Provider)}
          size="sm"
        >
          <option value="anthropic">Anthropic</option>
          <option value="openai">OpenAI</option>
          <option value="straico">Straico</option>
        </SelectNative>
        <input
          className="tale-input"
          type="password"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder={provider === 'anthropic' ? 'sk-ant-...' : provider === 'straico' ? 'straico-key-...' : 'sk-...'}
          aria-label="API key"
          style={{ flex: 1, fontFamily: 'var(--mono-font-family)', fontSize: 'var(--text-xs-font-size)' }}
        />
      </Row>

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

      {/* Input */}
      <ChatInput onSend={onSend} disabled={isStreaming || !apiKey} />
    </Column>
  );
}
