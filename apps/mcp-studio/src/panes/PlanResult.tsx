import { useState, useMemo } from 'react';
import { marked } from 'marked';
import { Popover } from '@tale-ui/react/popover';
import { Button } from '@tale-ui/react/button';
import { Spinner } from '@tale-ui/react/spinner';
import { apiGetComponent } from '../lib/api';

interface PlanResultProps {
  markdown: string;
  onAuthorFix: (component: string) => void;
}

export function PlanResult({ markdown, onAuthorFix }: PlanResultProps) {
  const html = useMemo(() => marked.parse(markdown) as string, [markdown]);

  // Extract component names from "Recommended components" section for chips
  const componentNames = useMemo(() => {
    const names: string[] = [];
    const re = /\*\*(\w+)\*\*(?:\s*⚠️\s*\*\*deprecated\*\*)?\s*—/g;
    let m;
    while ((m = re.exec(markdown)) !== null) {
      if (!names.includes(m[1])) names.push(m[1]);
    }
    return names;
  }, [markdown]);

  return (
    <div>
      {componentNames.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)', marginBottom: 'var(--space-m)' }}>
          {componentNames.map(name => (
            <ComponentChip key={name} name={name} onAuthorFix={onAuthorFix} />
          ))}
        </div>
      )}
      <div
        className="plan-result"
        // Markdown from our own MCP server — not user-supplied HTML
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function ComponentChip({ name, onAuthorFix }: { name: string; onAuthorFix: (n: string) => void }) {
  const [details, setDetails] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !details) {
      setLoading(true);
      try {
        const data = await apiGetComponent(name);
        setDetails(data);
      } catch {
        setDetails({ error: `Could not load ${name}` });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Popover.Root isOpen={open} onOpenChange={handleOpen}>
      <Popover.Trigger className="component-chip">
        {name}
      </Popover.Trigger>
      <Popover.Popup style={{ maxWidth: '40rem', maxHeight: '50vh', overflowY: 'auto' }}>
        <div style={{ padding: 'var(--space-m)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-s)' }}>
            <strong>{name}</strong>
            <Button variant="ghost" size="sm" onPress={() => { setOpen(false); onAuthorFix(name); }}>
              + Author pitfall
            </Button>
          </div>
          {loading && <Spinner size="sm" />}
          {details !== null && (
            <pre style={{ fontSize: 'var(--text-xs-font-size)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {JSON.stringify(details as Record<string, unknown>, null, 2)}
            </pre>
          )}
        </div>
      </Popover.Popup>
    </Popover.Root>
  );
}
