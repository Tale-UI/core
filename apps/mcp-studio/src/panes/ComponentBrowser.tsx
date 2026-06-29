import * as React from 'react';
import { GridList } from '@tale-ui/react/grid-list';
import { Badge } from '@tale-ui/react/badge';
import { Button } from '@tale-ui/react/button';
import { TextField } from '@tale-ui/react/text-field';
import { Spinner } from '@tale-ui/react/spinner';
import { Banner } from '@tale-ui/react/banner';
import { apiListComponents, apiGetComponent, type ComponentSummary } from '../lib/api';

interface ComponentBrowserProps {
  onAuthorFix: (component: string) => void;
}

const STATUS_VARIANT: Record<string, 'neutral' | 'warning' | 'error'> = {
  stable: 'neutral',
  experimental: 'warning',
  deprecated: 'error',
};

export function ComponentBrowser({ onAuthorFix }: ComponentBrowserProps) {
  const [components, setComponents] = React.useState<ComponentSummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [detail, setDetail] = React.useState<Record<string, unknown> | null>(null);
  const [detailLoading, setDetailLoading] = React.useState(false);

  React.useEffect(() => {
    apiListComponents()
      .then(list => setComponents(list))
      .catch(err => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  const categories = React.useMemo(
    () => [...new Set(components.map(c => c.category).filter(Boolean))].sort(),
    [components],
  );

  const filtered = React.useMemo(() => {
    return components.filter(c => {
      if (category && c.category !== category) {return false;}
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) {return false;}
      return true;
    });
  }, [components, category, search]);

  const handleSelect = async (name: string) => {
    setSelected(name);
    setDetail(null);
    setDetailLoading(true);
    try {
      const data = await apiGetComponent(name);
      setDetail(data as Record<string, unknown>);
    } catch {
      setDetail({ error: `Could not load ${name}` });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Left: list */}
      <div style={{ display: 'flex', flexDirection: 'column', width: '17.5rem', flexShrink: 0, borderRight: '1px solid var(--neutral-20)', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-s) var(--space-m)', borderBottom: '1px solid var(--neutral-20)', flexShrink: 0 }}>
          <TextField.Root value={search} onChange={setSearch} aria-label="Search components">
            <TextField.Input placeholder="Search…" />
          </TextField.Root>
        </div>

        {/* Category chips */}
        {categories.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2xs)', padding: 'var(--space-xs) var(--space-m)', borderBottom: '1px solid var(--neutral-20)', flexShrink: 0 }}>
            <button
              className={`component-chip${!category ? ' component-chip--active' : ''}`}
              onClick={() => setCategory(null)}
              type="button"
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`component-chip${category === cat ? ' component-chip--active' : ''}`}
                onClick={() => setCategory(prev => prev === cat ? null : cat)}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading && (
            <div style={{ padding: 'var(--space-l)', display: 'flex', justifyContent: 'center' }}>
              <Spinner size="md" />
            </div>
          )}
          {error && (
            <Banner.Root variant="error" style={{ margin: 'var(--space-m)' }}>
              <Banner.Description>{error}</Banner.Description>
            </Banner.Root>
          )}
          {!loading && !error && (
            <GridList.Root
              aria-label="Components"
              selectionMode="single"
              onAction={key => void handleSelect(String(key))}
            >
              {filtered.map(c => (
                <GridList.Item
                  key={c.name}
                  id={c.name}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-xs) var(--space-m)' }}
                >
                  <span style={{ fontSize: 'var(--text-s-font-size)', fontWeight: selected === c.name ? 600 : 400 }}>
                    {c.name}
                  </span>
                  {c.status && c.status !== 'stable' && (
                    <Badge variant={STATUS_VARIANT[c.status] ?? 'neutral'} size="sm">
                      {c.status}
                    </Badge>
                  )}
                </GridList.Item>
              ))}
            </GridList.Root>
          )}
        </div>
      </div>

      {/* Right: detail */}
      <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-m)' }}>
        {!selected && (
          <div className="studio-hint">
            <span>Select a component to view its registry entry</span>
          </div>
        )}
        {selected && detailLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-xl)' }}>
            <Spinner size="md" />
          </div>
        )}
        {selected && detail && (
          <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-m)' }}>
              <strong style={{ fontSize: 'var(--label-m-font-size)' }}>{selected}</strong>
              <Button variant="neutral" size="sm" onPress={() => onAuthorFix(selected)}>
                + Author pitfall
              </Button>
            </div>
            <pre style={{ fontSize: 'var(--text-xs-font-size)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>
              {JSON.stringify(detail, null, 2)}
            </pre>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
