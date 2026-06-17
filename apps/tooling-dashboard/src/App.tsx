import * as React from 'react';
import { Badge } from '@tale-ui/react/badge';
import { Banner } from '@tale-ui/react/banner';
import { Button } from '@tale-ui/react/button';
import { Card } from '@tale-ui/react/card';
import { Column } from '@tale-ui/react/column';
import { EmptyState } from '@tale-ui/react/empty-state';
import { Icon } from '@tale-ui/react/icon';
import { IconButton } from '@tale-ui/react/icon-button';
import { Link } from '@tale-ui/react/link';
import { Row } from '@tale-ui/react/row';
import { Separator } from '@tale-ui/react/separator';
import { Table } from '@tale-ui/react/table';
import { Text } from '@tale-ui/react/text';
import { useStableCallback } from '@tale-ui/utils/useStableCallback';
import {
  ActivityIcon,
  BoxesIcon,
  CheckCircle2Icon,
  ClipboardIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  ServerIcon,
  TerminalIcon,
  WrenchIcon,
  XCircleIcon,
} from 'lucide-react';

interface ToolApplication {
  id: string;
  label: string;
  category: string;
  description: string;
  url: string;
  command: string;
  port?: number;
  sourcePath: string;
  tags: string[];
}

interface ToolCommand {
  label: string;
  command: string;
  description: string;
}

interface CommandGroup {
  label: string;
  commands: ToolCommand[];
}

interface ToolingManifest {
  applications: ToolApplication[];
  commandGroups: CommandGroup[];
}

interface ApplicationStatus {
  id: string;
  running: boolean;
  port?: number;
  url: string;
}

interface ProviderStatus {
  id: string;
  label: string;
  available: boolean;
  detail: string;
  requiresApiKey?: boolean;
}

interface ModelStatus {
  provider: string;
  id: string;
  label: string;
  value: string;
  source: string;
}

interface RuntimeStatus {
  applications: ApplicationStatus[];
  providers: ProviderStatus[];
  models: ModelStatus[];
  errors: Record<string, string>;
}

type IconComponent = NonNullable<React.ComponentProps<typeof Icon>['icon']>;
type BadgeVariant = NonNullable<React.ComponentProps<typeof Badge>['variant']>;
type StatusBadgeVariant = Extract<BadgeVariant, 'success' | 'warning' | 'error'>;

function statusText(running?: boolean) {
  if (running == null) {
    return 'checking';
  }
  return running ? 'running' : 'offline';
}

function statusBadgeVariant(running?: boolean): StatusBadgeVariant {
  if (running == null) {
    return 'warning';
  }
  return running ? 'success' : 'error';
}

function countStatusVariant(count: number, total: number): StatusBadgeVariant {
  if (total === 0) {
    return 'warning';
  }
  if (count === total) {
    return 'success';
  }
  if (count === 0) {
    return 'error';
  }
  return 'warning';
}

function countStatusLabel(count: number, total: number, complete: string, empty: string) {
  if (total === 0) {
    return 'checking';
  }
  if (count === total) {
    return complete;
  }
  if (count === 0) {
    return empty;
  }
  return 'partial';
}

function groupByCategory(applications: ToolApplication[]) {
  return applications.reduce<Record<string, ToolApplication[]>>((groups, app) => {
    groups[app.category] ??= [];
    groups[app.category].push(app);
    return groups;
  }, {});
}

function copyCommand(command: string) {
  void navigator.clipboard?.writeText(command);
}

function SectionHeading({
  id,
  icon,
  title,
  detail,
}: {
  id?: string;
  icon: IconComponent;
  title: string;
  detail?: string;
}) {
  return (
    <div className="td-section-heading">
      <Row gap="xs" align="center" wrap>
        <Icon icon={icon} size="sm" />
        <Text id={id} variant="title" size="l" as="h2">
          {title}
        </Text>
        {detail && (
          <Text variant="text" size="s" color="muted">
            {detail}
          </Text>
        )}
      </Row>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
  statusLabel,
  statusVariant,
}: {
  icon: IconComponent;
  label: string;
  value: string;
  detail: string;
  statusLabel: string;
  statusVariant: StatusBadgeVariant;
}) {
  return (
    <div className="td-summary-card">
      <Card.Root variant="filled" padding="md">
        <Card.Body>
          <Row gap="s" align="start">
            <span className="td-summary-icon" aria-hidden="true">
              <Icon icon={icon} size="md" />
            </span>
            <Column gap="2xs">
              <Text variant="label" size="s" color="muted">
                {label}
              </Text>
              <Row gap="2xs" align="baseline">
                <Text variant="heading" size="l">
                  {value}
                </Text>
                <Badge variant={statusVariant} size="sm" type="rounded">
                  {statusLabel}
                </Badge>
              </Row>
              <Text variant="text" size="s" color="muted">
                {detail}
              </Text>
            </Column>
          </Row>
        </Card.Body>
      </Card.Root>
    </div>
  );
}

export function App() {
  const [manifest, setManifest] = React.useState<ToolingManifest | null>(null);
  const [status, setStatus] = React.useState<RuntimeStatus | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const refresh = useStableCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [manifestRes, statusRes] = await Promise.all([
        fetch('/api/tooling/manifest'),
        fetch('/api/tooling/status'),
      ]);
      if (!manifestRes.ok) {
        throw new Error(`Manifest request failed (${manifestRes.status})`);
      }
      if (!statusRes.ok) {
        throw new Error(`Status request failed (${statusRes.status})`);
      }
      setManifest((await manifestRes.json()) as ToolingManifest);
      setStatus((await statusRes.json()) as RuntimeStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRefreshing(false);
    }
  });

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const applications = React.useMemo(() => manifest?.applications ?? [], [manifest]);
  const providers = React.useMemo(() => status?.providers ?? [], [status]);
  const models = React.useMemo(() => status?.models ?? [], [status]);
  const commandGroups = React.useMemo(() => manifest?.commandGroups ?? [], [manifest]);
  const appUrls = React.useMemo(
    () => new Map(applications.map((app) => [app.id, app.url])),
    [applications],
  );
  const commandCount = commandGroups.reduce((count, group) => count + group.commands.length, 0);
  const runningCount = status?.applications.filter((app) => app.running).length ?? 0;
  const availableProviderCount = providers.filter((provider) => provider.available).length;

  const appStatuses = React.useMemo(() => {
    return new Map(status?.applications.map((app) => [app.id, app]) ?? []);
  }, [status]);

  const providerLabels = React.useMemo(() => {
    return new Map(providers.map((provider) => [provider.id, provider.label]));
  }, [providers]);

  const groupedApps = React.useMemo(() => groupByCategory(applications), [applications]);

  return (
    <div className="td-root">
      <header className="td-topbar">
        <div className="td-topbar__inner">
          <div className="td-brand">
            <Row gap="s" align="center">
              <span className="td-brand-icon" aria-hidden="true">
                <Icon icon={WrenchIcon} size="md" />
              </span>
              <Column gap="4xs">
                <Text as="h1" variant="heading" size="l">
                  Tale UI Tooling
                </Text>
                <Text as="p" variant="text" size="s" color="muted">
                  Local apps, provider status, and maintainer commands
                </Text>
              </Column>
            </Row>
          </div>

          <nav className="td-actions" aria-label="Primary tooling links">
            <Row gap="xs" align="center" justify="end" wrap>
              <Link href={appUrls.get('vite-playground') ?? 'http://localhost:5173/'}>
                Vite Playground
              </Link>
              <Link href={appUrls.get('mcp-studio') ?? 'http://localhost:5175/'}>MCP Studio</Link>
              <Button
                variant="primary"
                size="sm"
                onPress={() => void refresh()}
                isPending={refreshing}
                showTextWhileLoading
              >
                <Icon icon={RefreshCwIcon} size="sm" />
                Refresh
              </Button>
            </Row>
          </nav>
        </div>
      </header>

      <main className="td-main">
        <Column gap="l">
          {error && (
            <Banner.Root variant="error">
              <Banner.Icon>
                <Icon icon={XCircleIcon} size="sm" />
              </Banner.Icon>
              <Banner.Title>Dashboard data failed</Banner.Title>
              <Banner.Description>{error}</Banner.Description>
              <Banner.Actions>
                <Button variant="danger-ghost" size="sm" onPress={() => void refresh()}>
                  Retry
                </Button>
              </Banner.Actions>
            </Banner.Root>
          )}

          <div className="td-summary-grid">
            <SummaryCard
              icon={ServerIcon}
              label="Applications"
              value={`${runningCount}/${applications.length}`}
              detail="local surfaces responding on their configured ports"
              statusLabel={countStatusLabel(runningCount, applications.length, 'running', 'offline')}
              statusVariant={countStatusVariant(runningCount, applications.length)}
            />
            <SummaryCard
              icon={DatabaseIcon}
              label="Providers"
              value={`${availableProviderCount}/${providers.length}`}
              detail="provider CLIs and credentials available to the backend"
              statusLabel={countStatusLabel(availableProviderCount, providers.length, 'available', 'unavailable')}
              statusVariant={countStatusVariant(availableProviderCount, providers.length)}
            />
            <SummaryCard
              icon={TerminalIcon}
              label="Commands"
              value={String(commandCount)}
              detail="curated workspace commands for daily maintenance"
              statusLabel={commandCount > 0 ? 'ready' : 'checking'}
              statusVariant={commandCount > 0 ? 'success' : 'warning'}
            />
          </div>

          <section className="td-section" aria-labelledby="td-applications-heading">
            <SectionHeading
              id="td-applications-heading"
              icon={ActivityIcon}
              title="Applications"
              detail="Tooling and playground surfaces served from this workspace"
            />
            <Column gap="m">
              {Object.entries(groupedApps).length > 0 ? (
                Object.entries(groupedApps).map(([category, apps]) => (
                  <Column key={category} gap="xs">
                    <div className="td-category-title">
                      <Text variant="label" size="s" color="muted">
                        {category}
                      </Text>
                    </div>
                    <div className="td-app-grid">
                      {apps.map((app) => {
                        const appStatus = appStatuses.get(app.id);
                        return (
                          <div key={app.id} className="td-app-card">
                            <Card.Root variant="outlined" padding="md">
                              <Card.Header>
                                <Row justify="between" align="start" gap="s">
                                  <Column gap="4xs">
                                    <Text variant="title" size="s" as="h3">
                                      {app.label}
                                    </Text>
                                    <Text variant="mono" size="xs" color="muted">
                                      {app.sourcePath}
                                    </Text>
                                  </Column>
                                  <Badge
                                    variant={statusBadgeVariant(appStatus?.running)}
                                    size="sm"
                                    type="rounded"
                                  >
                                    {statusText(appStatus?.running)}
                                  </Badge>
                                </Row>
                              </Card.Header>
                              <Card.Body>
                                <Column gap="xs">
                                  <Text as="p" variant="text" size="s" color="muted">
                                    {app.description}
                                  </Text>
                                  <Row gap="2xs" wrap>
                                    {app.tags.map((tag) => (
                                      <Badge key={tag} variant="neutral" size="sm" type="rounded">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </Row>
                                  <code className="td-code-block">{app.command}</code>
                                </Column>
                              </Card.Body>
                              <Card.Footer>
                                <Row gap="xs" wrap>
                                  <Link href={app.url}>
                                    <Icon icon={ExternalLinkIcon} size="sm" />
                                    Open
                                  </Link>
                                  <Button
                                    variant="neutral"
                                    size="sm"
                                    onPress={() => copyCommand(app.command)}
                                  >
                                    <Icon icon={ClipboardIcon} size="sm" />
                                    Copy command
                                  </Button>
                                </Row>
                              </Card.Footer>
                            </Card.Root>
                          </div>
                        );
                      })}
                    </div>
                  </Column>
                ))
              ) : (
                <EmptyState.Root>
                  <EmptyState.Icon>
                    <Icon icon={BoxesIcon} size="lg" />
                  </EmptyState.Icon>
                  <EmptyState.Title>No applications loaded</EmptyState.Title>
                  <EmptyState.Description>
                    The dashboard manifest has not returned application metadata yet.
                  </EmptyState.Description>
                </EmptyState.Root>
              )}
            </Column>
          </section>

          <div className="td-lower-grid">
            <section className="td-section" aria-labelledby="td-providers-heading">
              <div className="td-panel-card">
                <Card.Root variant="outlined" padding="md">
                  <Card.Header>
                    <SectionHeading
                      id="td-providers-heading"
                      icon={WrenchIcon}
                      title="Providers"
                      detail="Credential and model discovery status"
                    />
                  </Card.Header>
                  <Card.Body>
                    {providers.length > 0 ? (
                      <ul className="td-provider-list">
                        {providers.map((provider) => {
                          const count = models.filter((model) => model.provider === provider.id).length;
                          return (
                            <li key={provider.id} className="td-provider-row">
                              <Row justify="between" align="start" gap="s">
                                <Row gap="s" align="start">
                                  <span
                                    className={
                                      provider.available
                                        ? 'td-provider-icon td-provider-icon--available'
                                        : 'td-provider-icon'
                                    }
                                    aria-hidden="true"
                                  >
                                    <Icon
                                      icon={provider.available ? CheckCircle2Icon : XCircleIcon}
                                      size="sm"
                                    />
                                  </span>
                                  <Column gap="4xs">
                                    <Text variant="label" size="m">
                                      {provider.label}
                                    </Text>
                                    <Text variant="text" size="s" color="muted">
                                      {provider.detail}
                                    </Text>
                                  </Column>
                                </Row>
                                <Column gap="4xs" align="end">
                                  <Badge
                                    variant={provider.available ? 'success' : 'error'}
                                    size="sm"
                                    type="rounded"
                                  >
                                    {provider.available ? 'available' : 'unavailable'}
                                  </Badge>
                                  <Text variant="text" size="xs" color="muted">
                                    {count} models
                                  </Text>
                                </Column>
                              </Row>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <EmptyState.Root size="sm">
                        <EmptyState.Title>No providers checked</EmptyState.Title>
                        <EmptyState.Description>
                          Refresh the dashboard to query local provider status.
                        </EmptyState.Description>
                      </EmptyState.Root>
                    )}
                  </Card.Body>
                </Card.Root>
              </div>
            </section>

            <section className="td-section" aria-labelledby="td-commands-heading">
              <SectionHeading
                id="td-commands-heading"
                icon={TerminalIcon}
                title="Commands"
                detail="Copy-ready workspace tasks"
              />
              <Column gap="s">
                {commandGroups.map((group) => (
                  <div key={group.label} className="td-command-card">
                    <Card.Root variant="outlined" padding="md">
                      <Card.Header>
                        <Text variant="title" size="s" as="h3">
                          {group.label}
                        </Text>
                      </Card.Header>
                      <Card.Body>
                        <Column gap="s">
                          {group.commands.map((command, index) => (
                            <React.Fragment key={command.command}>
                              {index > 0 && <Separator />}
                              <div className="td-command-row">
                                <Row justify="between" align="center" gap="s">
                                  <Column gap="2xs">
                                    <Text variant="label" size="s">
                                      {command.label}
                                    </Text>
                                    <Text variant="text" size="xs" color="muted">
                                      {command.description}
                                    </Text>
                                    <code className="td-code-inline">{command.command}</code>
                                  </Column>
                                  <IconButton
                                    aria-label={`Copy ${command.label} command`}
                                    variant="neutral"
                                    size="sm"
                                    onPress={() => copyCommand(command.command)}
                                  >
                                    <Icon icon={ClipboardIcon} size="sm" />
                                  </IconButton>
                                </Row>
                              </div>
                            </React.Fragment>
                          ))}
                        </Column>
                      </Card.Body>
                    </Card.Root>
                  </div>
                ))}
              </Column>
            </section>
          </div>

          <section className="td-section" aria-labelledby="td-models-heading">
            <div className="td-model-card">
              <Card.Root variant="outlined" padding="md">
                <Card.Header>
                  <SectionHeading
                    id="td-models-heading"
                    icon={DatabaseIcon}
                    title="Available Models"
                    detail="Model routes discovered through the provider backend"
                  />
                </Card.Header>
                <Card.Body>
                  {models.length > 0 ? (
                    <div className="td-table-wrap">
                      <Table.Root aria-label="Available provider models">
                        <Table.Header>
                          <Table.Column id="provider" isRowHeader>
                            Provider
                          </Table.Column>
                          <Table.Column id="model">Model</Table.Column>
                          <Table.Column id="source">Source</Table.Column>
                          <Table.Column id="route">Route value</Table.Column>
                        </Table.Header>
                        <Table.Body>
                          {models.map((model) => (
                            <Table.Row key={model.value} id={model.value}>
                              <Table.Cell>
                                <Badge variant="brand" size="sm" type="rounded">
                                  {providerLabels.get(model.provider) ?? model.provider}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <Text variant="label" size="s">
                                  {model.label}
                                </Text>
                              </Table.Cell>
                              <Table.Cell>
                                <Badge variant="neutral" size="sm" type="modern">
                                  {model.source}
                                </Badge>
                              </Table.Cell>
                              <Table.Cell>
                                <code className="td-route-value">{model.value}</code>
                              </Table.Cell>
                            </Table.Row>
                          ))}
                        </Table.Body>
                      </Table.Root>
                    </div>
                  ) : (
                    <EmptyState.Root size="sm">
                      <EmptyState.Icon>
                        <Icon icon={DatabaseIcon} size="lg" />
                      </EmptyState.Icon>
                      <EmptyState.Title>No models discovered</EmptyState.Title>
                      <EmptyState.Description>
                        Start or authenticate a provider, then refresh this dashboard.
                      </EmptyState.Description>
                    </EmptyState.Root>
                  )}
                </Card.Body>
              </Card.Root>
            </div>
          </section>
        </Column>
      </main>
    </div>
  );
}
