/**
 * A2UI Interactive Demo
 *
 * Demonstrates the A2UI renderer rendering Tale UI components from
 * A2UI JSON messages. Includes pre-built examples and a live JSON editor.
 */

import * as React from 'react';
import { A2UIProvider, A2UISurface, useA2UI } from '@tale-ui/a2ui/renderer';
import { taleUICatalog } from '@tale-ui/a2ui/catalog';
import { validateMessages, formatErrors } from '@tale-ui/a2ui/validation';
import type { A2UIMessage } from '@tale-ui/a2ui/types';

// Pre-built examples
import simpleForm from '@tale-ui/a2ui/src/agent/examples/simple-form.json';
import cardList from '@tale-ui/a2ui/src/agent/examples/card-list.json';
import dashboard from '@tale-ui/a2ui/src/agent/examples/dashboard.json';
import settingsPage from '@tale-ui/a2ui/src/agent/examples/settings-page.json';
import componentAudit from '@tale-ui/a2ui/src/agent/examples/component-audit.json';
import fullShowcase from '@tale-ui/a2ui/src/agent/examples/full-showcase.json';

const examples: Record<string, { description: string; messages: unknown[] }> = {
  'full-showcase': fullShowcase,
  'component-audit': componentAudit,
  'simple-form': simpleForm,
  'card-list': cardList,
  dashboard,
  'settings-page': settingsPage,
};

/* ─── Message Feeder ──────────────────────────────────────────────────────── */

function MessageFeeder({ messages }: { messages: A2UIMessage[] }) {
  const { processMessage, reset } = useA2UI();

  React.useEffect(() => {
    reset();
    for (const msg of messages) {
      processMessage(msg);
    }
  }, [messages, processMessage, reset]);

  return null;
}

/* ─── Demo Component ──────────────────────────────────────────────────────── */

export default function A2UIDemo() {
  const [selectedExample, setSelectedExample] = React.useState('full-showcase');
  const [messages, setMessages] = React.useState<A2UIMessage[]>(
    fullShowcase.messages as A2UIMessage[],
  );
  const [jsonText, setJsonText] = React.useState('');
  const [validationOutput, setValidationOutput] = React.useState('');
  const [actionLog, setActionLog] = React.useState<string[]>([]);

  // Update messages when example changes
  React.useEffect(() => {
    const example = examples[selectedExample];
    if (example) {
      const msgs = example.messages as A2UIMessage[];
      setMessages(msgs);
      setJsonText(JSON.stringify(msgs, null, 2));
      setValidationOutput('');
    }
  }, [selectedExample]);

  const handleAction = React.useCallback(
    (surfaceId: string, action: { name: string; context?: Record<string, unknown> }) => {
      const entry = `[${new Date().toLocaleTimeString()}] ${surfaceId} → ${action.name}(${JSON.stringify(action.context ?? {})})`;
      setActionLog((prev) => [entry, ...prev].slice(0, 20));
    },
    [],
  );

  const handleLoadJson = React.useCallback(() => {
    try {
      const parsed = JSON.parse(jsonText);
      const msgs = Array.isArray(parsed) ? parsed : [parsed];

      // Validate
      const result = validateMessages(msgs, taleUICatalog);
      if (!result.valid) {
        setValidationOutput(formatErrors(result.errors));
        return;
      }

      setValidationOutput('Valid!');
      setMessages(msgs as A2UIMessage[]);
    } catch (entry) {
      setValidationOutput(`JSON parse error: ${(entry as Error).message}`);
    }
  }, [jsonText]);

  // Extract surfaceId from messages
  const surfaceId = React.useMemo(() => {
    for (const msg of messages) {
      if ('surfaceId' in msg) {return (msg as { surfaceId: string }).surfaceId;}
    }
    return 'main';
  }, [messages]);

  return (
    <div style={{ display: 'flex', gap: 'var(--space-m)', minHeight: '80vh' }}>
      {/* Left panel: controls */}
      <div style={{ width: '400px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}>
        <h2 style={{ margin: 0 }}>A2UI Demo</h2>

        {/* Example selector */}
        <div>
          <label htmlFor="example-select" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
            Example:
          </label>
          <select
            id="example-select"
            value={selectedExample}
            onChange={(entry) => setSelectedExample(entry.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--neutral-22)' }}
          >
            {Object.entries(examples).map(([key, ex]) => (
              <option key={key} value={key}>
                {ex.description}
              </option>
            ))}
          </select>
        </div>

        {/* JSON editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="json-editor" style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
            A2UI Messages (JSON):
          </label>
          <textarea
            id="json-editor"
            value={jsonText}
            onChange={(entry) => setJsonText(entry.target.value)}
            style={{
              flex: 1,
              minHeight: '200px',
              padding: '8px',
              fontFamily: 'var(--mono-font-family)',
              fontSize: '12px',
              borderRadius: '6px',
              border: '1px solid var(--neutral-22)',
              resize: 'vertical',
            }}
          />
          <button type="button"
            onClick={handleLoadJson}
            style={{
              marginTop: '8px',
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: 'var(--color-60)',
              color: 'var(--color-60-fg)',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Load JSON
          </button>
          {validationOutput && (
            <pre
              style={{
                marginTop: '8px',
                padding: '8px',
                borderRadius: '6px',
                background: validationOutput === 'Valid!' ? 'var(--success-10)' : 'var(--error-10)',
                color: validationOutput === 'Valid!' ? 'var(--success-70)' : 'var(--error-70)',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {validationOutput}
            </pre>
          )}
        </div>

        {/* Action log */}
        <div>
          <h3 style={{ margin: '0 0 4px' }}>Action Log</h3>
          <div
            style={{
              height: '120px',
              overflow: 'auto',
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid var(--neutral-22)',
              fontFamily: 'var(--mono-font-family)',
              fontSize: '11px',
            }}
          >
            {actionLog.length === 0 ? (
              <span style={{ color: 'var(--neutral-50)' }}>
                Click buttons in the rendered UI to see actions here...
              </span>
            ) : (
              actionLog.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
      </div>

      {/* Right panel: rendered surface */}
      <div
        style={{
          flex: 1,
          padding: 'var(--space-m)',
          borderRadius: 'var(--radius-l)',
          border: '1px solid var(--neutral-20)',
          background: 'var(--neutral-5)',
        }}
      >
        <A2UIProvider catalog={taleUICatalog} onAction={handleAction}>
          <MessageFeeder messages={messages} />
          <A2UISurface
            surfaceId={surfaceId}
            fallback={<p style={{ color: 'var(--neutral-50)' }}>No surface rendered yet.</p>}
          />
        </A2UIProvider>
      </div>
    </div>
  );
}
