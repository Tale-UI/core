import * as React from 'react';
import { Drawer } from '@tale-ui/react/drawer';
import { Button } from '@tale-ui/react/button';
import { TextField } from '@tale-ui/react/text-field';
import { TextArea } from '@tale-ui/react/text-area';
import { Select } from '@tale-ui/react/select';
import { Banner } from '@tale-ui/react/banner';
import { Spinner } from '@tale-ui/react/spinner';
import { apiListComponents, apiWritePitfall, type ComponentSummary } from '../lib/api';
import { transpileTsx } from '../lib/transpile';

interface AuthorFixDrawerProps {
  isOpen: boolean;
  defaultComponent?: string;
  onClose: () => void;
}

interface FormState {
  component: string;
  slug: string;
  summary: string;
  detail: string;
  antiPattern: string;
  fix: string;
  completeExample: string;
}

const EMPTY_FORM: FormState = {
  component: '',
  slug: '',
  summary: '',
  detail: '',
  antiPattern: '',
  fix: '',
  completeExample: '',
};

function slugFromSummary(summary: string, component: string) {
  const base = component
    .replace(/([A-Z])/g, m => `-${m.toLowerCase()}`)
    .replace(/^-/, '');
  const words = summary
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .slice(0, 4)
    .join('-');
  return words ? `${base}-${words}` : base;
}

function detectMultiIdea(summary: string): boolean {
  const stripped = summary.replace(/`[^`]*`/g, '');
  return stripped.includes(';') || /\band\b/.test(stripped);
}

export function AuthorFixDrawer({ isOpen, defaultComponent, onClose }: AuthorFixDrawerProps) {
  const [form, setForm] = React.useState<FormState>(EMPTY_FORM);
  const [components, setComponents] = React.useState<ComponentSummary[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [result, setResult] = React.useState<{ ok?: boolean; error?: string; rolledBack?: boolean } | null>(null);
  const [exampleError, setExampleError] = React.useState<string | null>(null);

  React.useEffect(() => {
    apiListComponents()
      .then(list => setComponents(list))
      .catch(() => { /* optional */ });
  }, []);

  React.useEffect(() => {
    if (defaultComponent) {
      setForm(prev => ({
        ...prev,
        component: defaultComponent,
        slug: slugFromSummary(prev.summary, defaultComponent),
      }));
    }
  }, [defaultComponent]);

  React.useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setExampleError(null);
    }
  }, [isOpen]);

  const set = React.useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'summary' && !prev.slug) {
        next.slug = slugFromSummary(value as string, prev.component);
      }
      return next;
    });
  }, []);

  const validateExample = React.useCallback(async () => {
    if (!form.completeExample.trim()) { setExampleError(null); return true; }
    const r = await transpileTsx(form.completeExample);
    if ('error' in r) { setExampleError(r.error ?? null); return false; }
    setExampleError(null);
    return true;
  }, [form.completeExample]);

  const handleSave = async () => {
    setResult(null);
    const exOk = await validateExample();
    if (!exOk) {return;}
    setSaving(true);
    try {
      const res = await apiWritePitfall({
        component: form.component,
        slug: form.slug,
        summary: form.summary,
        detail: form.detail,
        antiPattern: form.antiPattern,
        fix: form.fix,
        completeExample: form.completeExample,
      });
      setResult(res);
      if (res.ok) {setForm(EMPTY_FORM);}
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : String(err) });
    } finally {
      setSaving(false);
    }
  };

  const multiIdea = detectMultiIdea(form.summary);
  const summaryLen = form.summary.length;
  const summaryOverLimit = summaryLen > 180;
  const canSave = !saving && !!form.component && !!form.slug && !!form.summary && !!form.antiPattern && !!form.fix && !summaryOverLimit;

  return (
    <Drawer.Root open={isOpen} onOpenChange={open => { if (!open) {onClose();} }}>
      <Drawer.Backdrop />
      <Drawer.Popup style={{ width: '27.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 'var(--space-m)', borderBottom: '1px solid var(--neutral-20)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Drawer.Title>Author pitfall fix</Drawer.Title>
          <Drawer.Close className="tale-button tale-button--ghost tale-button--sm">✕</Drawer.Close>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-m)', display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>

          {/* Component */}
          <Select.Root
            placeholder="Select component…"
            selectedKey={form.component || null}
            onSelectionChange={k => {
              const name = k as string;
              setForm(prev => ({
                ...prev,
                component: name,
                slug: slugFromSummary(prev.summary, name),
              }));
            }}
          >
            <Select.Label>Component</Select.Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Popover>
              <Select.ListBox>
                {components.map(c => (
                  <Select.Item key={c.name} id={c.name}>{c.name}</Select.Item>
                ))}
              </Select.ListBox>
            </Select.Popover>
          </Select.Root>

          {/* Slug */}
          <TextField.Root value={form.slug} onChange={v => set('slug', v)}>
            <TextField.Label>Slug</TextField.Label>
            <TextField.Input placeholder="kebab-case, e.g. button-missing-variant" />
          </TextField.Root>

          {/* Summary */}
          <div>
            <TextField.Root
              value={form.summary}
              onChange={v => set('summary', v)}
              isInvalid={summaryOverLimit}
            >
              <TextField.Label>Summary</TextField.Label>
              <TextField.Input placeholder="One-line description of the pitfall" />
              <TextField.Description>{summaryLen}/180{summaryOverLimit ? ' — too long' : ''}</TextField.Description>
            </TextField.Root>
            {multiIdea && (
              <div style={{ marginTop: 'var(--space-2xs)', fontSize: 'var(--text-xs-font-size)', color: 'var(--red-60)' }}>
                Summary contains `;` or `and` outside backticks — split into separate pitfalls.
              </div>
            )}
          </div>

          {/* Detail (optional) */}
          <TextField.Root value={form.detail} onChange={v => set('detail', v)}>
            <TextField.Label>Detail (optional)</TextField.Label>
            <TextField.Input placeholder="Longer explanation after the em-dash" />
          </TextField.Root>

          {/* Anti-pattern */}
          <TextField.Root value={form.antiPattern} onChange={v => set('antiPattern', v)}>
            <TextField.Label>Anti-pattern</TextField.Label>
            <TextField.Input placeholder="The incorrect usage (will be wrapped in backticks)" />
          </TextField.Root>

          {/* Fix */}
          <TextField.Root value={form.fix} onChange={v => set('fix', v)}>
            <TextField.Label>Fix</TextField.Label>
            <TextField.Input placeholder="The correct usage (will be wrapped in backticks)" />
          </TextField.Root>

          {/* Complete example */}
          <div>
            <TextArea.Root value={form.completeExample} onChange={v => set('completeExample', v)}>
              <TextArea.Label>Complete example (TSX, optional)</TextArea.Label>
              <TextArea.TextArea
                placeholder={'export function Example() {\n  return …;\n}'}
                style={{ fontFamily: 'monospace', minHeight: '10rem' }}
              />
              <TextArea.Description>Full export function — validated with Sucrase before saving.</TextArea.Description>
            </TextArea.Root>
            {exampleError && (
              <Banner.Root variant="error" style={{ marginTop: 'var(--space-xs)' }}>
                <Banner.Title>Syntax error</Banner.Title>
                <Banner.Description style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs-font-size)', whiteSpace: 'pre-wrap' }}>
                  {exampleError}
                </Banner.Description>
              </Banner.Root>
            )}
          </div>

          {/* Results */}
          {result?.ok && (
            <Banner.Root variant="success">
              <Banner.Title>Pitfall saved</Banner.Title>
              <Banner.Description>Registry regenerated and shape audit passed.</Banner.Description>
            </Banner.Root>
          )}
          {result?.error && (
            <Banner.Root variant="error">
              <Banner.Title>{result.rolledBack ? 'Audit failed — changes rolled back' : 'Error'}</Banner.Title>
              <Banner.Description style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs-font-size)', whiteSpace: 'pre-wrap' }}>
                {result.error}
              </Banner.Description>
            </Banner.Root>
          )}
        </div>

        <div style={{ padding: 'var(--space-m)', borderTop: '1px solid var(--neutral-20)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-s)' }}>
          <Button variant="ghost" size="md" onPress={onClose} isDisabled={saving}>Cancel</Button>
          <Button variant="primary" size="md" onPress={handleSave} isDisabled={!canSave}>
            {saving ? <Spinner size="sm" /> : null}
            Save pitfall
          </Button>
        </div>
      </Drawer.Popup>
    </Drawer.Root>
  );
}
