import * as React from 'react';
import { Button } from '@tale-ui/react/button';
import { TextArea } from '@tale-ui/react/text-area';
import { TextField } from '@tale-ui/react/text-field';
import { Select } from '@tale-ui/react/select';
import { Spinner } from '@tale-ui/react/spinner';
import { Banner } from '@tale-ui/react/banner';
import {
  apiPlanUi,
  apiGenerate,
  apiModels,
  type GoldenPrompt,
  type StudioModel,
  type StudioProvider,
  type StudioProviderStatus,
} from '../lib/api';
import { PlanResult } from './PlanResult';
import { PreviewPane } from './PreviewPane';

const STRAICO_API_KEY_STORAGE_KEY = 'tale-ui:mcp-studio:straico-api-key';
const PROVIDER_STORAGE_KEY = 'tale-ui:mcp-studio:provider';
const MODEL_STORAGE_KEY = 'tale-ui:mcp-studio:model';
const DEFAULT_PROVIDER_VALUE: StudioProvider = 'claude';
const DEFAULT_MODEL_VALUE = 'claude:sonnet';
const PROVIDER_VALUES = ['claude', 'codex', 'ollama', 'straico'] as const;

const providerLabels: Record<StudioProvider, string> = {
  claude: 'Claude',
  codex: 'OpenAI (Codex)',
  ollama: 'Ollama',
  straico: 'Straico',
};

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

function readStoredStraicoApiKey(): string {
  return readStoredString(STRAICO_API_KEY_STORAGE_KEY);
}

function readStoredProvider(): StudioProvider {
  const value = readStoredString(PROVIDER_STORAGE_KEY);
  return isStudioProvider(value) ? value : DEFAULT_PROVIDER_VALUE;
}

function readStoredModel(): string {
  return readStoredString(MODEL_STORAGE_KEY) || DEFAULT_MODEL_VALUE;
}

function formatModelErrors(errors: Partial<Record<StudioProvider, string>>): string | null {
  const messages = Object.entries(errors).map(([provider, message]) => `${provider}: ${message}`);
  return messages.length > 0 ? messages.join(' / ') : null;
}

interface PromptStudioProps {
  onAuthorFix: (component: string) => void;
}

export function PromptStudio({ onAuthorFix }: PromptStudioProps) {
  const [prompt, setPrompt] = React.useState('');
  const [planText, setPlanText] = React.useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = React.useState<string | null>(null);
  const [planning, setPlanning] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [goldens, setGoldens] = React.useState<GoldenPrompt[]>([]);
  const [providers, setProviders] = React.useState<StudioProviderStatus[]>([]);
  const [models, setModels] = React.useState<StudioModel[]>([]);
  const [providerValue, setProviderValue] = React.useState<StudioProvider>(readStoredProvider);
  const [modelValue, setModelValue] = React.useState(readStoredModel);
  const [modelLoading, setModelLoading] = React.useState(false);
  const [modelError, setModelError] = React.useState<string | null>(null);
  const [straicoApiKey, setStraicoApiKey] = React.useState(readStoredStraicoApiKey);
  const initialStraicoApiKey = React.useRef(straicoApiKey);
  const providerValueRef = React.useRef(providerValue);

  React.useEffect(() => {
    fetch('/api/golden-prompts')
      .then((r) => r.json())
      .then((prompts) => setGoldens(prompts as GoldenPrompt[]))
      .catch(() => {
        /* golden prompts are optional */
      });
  }, []);

  React.useEffect(() => {
    providerValueRef.current = providerValue;
  }, [providerValue]);

  const loadModels = React.useCallback(async (apiKey: string) => {
    setModelLoading(true);
    setModelError(null);
    try {
      const currentProvider = providerValueRef.current;
      const result = await apiModels({ straicoApiKey: apiKey.trim() || undefined });
      setProviders(result.providers);
      setModels(result.models);
      setProviderValue((current) =>
        result.providers.some((provider) => provider.id === current)
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
    writeStoredString(STRAICO_API_KEY_STORAGE_KEY, straicoApiKey.trim() ? straicoApiKey : '');
  }, [straicoApiKey]);

  React.useEffect(() => {
    writeStoredString(PROVIDER_STORAGE_KEY, providerValue);
  }, [providerValue]);

  React.useEffect(() => {
    writeStoredString(MODEL_STORAGE_KEY, modelValue);
  }, [modelValue]);

  const providerModels = React.useMemo(
    () => models.filter((model) => model.provider === providerValue),
    [models, providerValue],
  );

  const selectedModel = React.useMemo(
    () => providerModels.find((model) => model.value === modelValue) ?? null,
    [providerModels, modelValue],
  );

  const handleProviderChange = React.useCallback(
    (key: React.Key | null) => {
      if (key == null) {
        return;
      }
      const provider = String(key) as StudioProvider;
      setProviderValue(provider);
      const firstProviderModel = models.find((model) => model.provider === provider);
      setModelValue(firstProviderModel?.value ?? '');
    },
    [models],
  );

  const handlePlan = React.useCallback(async () => {
    if (!prompt.trim()) {
      return;
    }
    setPlanning(true);
    setError(null);
    setPlanText(null);
    setGeneratedCode(null);
    try {
      const text = await apiPlanUi(prompt.trim());
      setPlanText(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPlanning(false);
    }
  }, [prompt]);

  const handleGenerate = React.useCallback(async () => {
    if (!prompt.trim()) {
      return;
    }
    if (!selectedModel) {
      setError('Select a model before generating.');
      return;
    }
    if (selectedModel.provider === 'straico' && !straicoApiKey.trim()) {
      setError('Enter a Straico API key before generating with Straico.');
      return;
    }
    setError(null);
    // Run plan and generate in parallel
    setPlanning(true);
    setGenerating(true);
    setPlanText(null);
    setGeneratedCode(null);
    try {
      const [planResult, genResult] = await Promise.allSettled([
        apiPlanUi(prompt.trim()),
        apiGenerate(prompt.trim(), {
          provider: selectedModel.provider,
          model: selectedModel.id,
          straicoApiKey: selectedModel.provider === 'straico' ? straicoApiKey.trim() : undefined,
        }),
      ]);
      if (planResult.status === 'fulfilled') {
        setPlanText(planResult.value);
      }
      if (genResult.status === 'fulfilled') {
        setGeneratedCode(genResult.value);
      }
      const err =
        planResult.status === 'rejected'
          ? planResult.reason
          : genResult.status === 'rejected'
            ? genResult.reason
            : null;
      if (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    } finally {
      setPlanning(false);
      setGenerating(false);
    }
  }, [prompt, selectedModel, straicoApiKey]);

  return (
    <div className="studio-panes">
      {/* Prompt pane */}
      <div className="studio-pane studio-pane--prompt">
        <div className="studio-pane-header">Prompt</div>
        <div
          className="studio-pane-body"
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}
        >
          {goldens.length > 0 && (
            <Select.Root
              placeholder="Load a golden prompt…"
              onSelectionChange={(key) => {
                const g = goldens.find((x) => x.slug === key);
                if (g) {
                  setPrompt(g.prompt);
                }
              }}
            >
              <Select.Label>Golden prompts</Select.Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Icon />
              </Select.Trigger>
              <Select.Popover>
                <Select.ListBox>
                  {goldens.map((g) => (
                    <Select.Item key={g.slug} id={g.slug}>
                      [{g.difficulty}] {g.slug}
                    </Select.Item>
                  ))}
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          )}

          <Select.Root selectedKey={providerValue} onSelectionChange={handleProviderChange}>
            <Select.Label>Provider</Select.Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Icon />
            </Select.Trigger>
            <Select.Popover>
              <Select.ListBox>
                {providers.map((provider) => (
                  <Select.Item key={provider.id} id={provider.id}>
                    {providerLabels[provider.id]} - {provider.detail}
                  </Select.Item>
                ))}
              </Select.ListBox>
            </Select.Popover>
          </Select.Root>

          {providerValue === 'straico' && (
            <TextField.Root value={straicoApiKey} onChange={setStraicoApiKey}>
              <TextField.Label>Straico API key</TextField.Label>
              <TextField.Input placeholder="sk-..." type="password" />
            </TextField.Root>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-s)', flexWrap: 'wrap' }}>
            <Button
              variant="neutral"
              size="sm"
              onPress={() => void loadModels(straicoApiKey)}
              isDisabled={modelLoading}
            >
              {modelLoading ? <Spinner size="sm" /> : null}
              {providerValue === 'straico' ? 'Load Straico models' : 'Refresh models'}
            </Button>
          </div>

          <Select.Root
            selectedKey={modelValue || null}
            placeholder={modelLoading ? 'Loading models...' : 'Select a model...'}
            onSelectionChange={(key) => {
              if (key != null) {
                setModelValue(String(key));
              }
            }}
            isDisabled={modelLoading || providerModels.length === 0}
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

          <TextArea.Root value={prompt} onChange={setPrompt}>
            <TextArea.Label className="sr-only">UI prompt</TextArea.Label>
            <TextArea.TextArea
              placeholder="Describe the UI you want to build…"
              style={{ minHeight: '8.75rem', fontFamily: 'inherit' }}
            />
          </TextArea.Root>

          <div style={{ display: 'flex', gap: 'var(--space-s)', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="md"
              onPress={handleGenerate}
              isDisabled={planning || generating || !prompt.trim() || !selectedModel}
            >
              {generating ? <Spinner size="sm" /> : null}
              Generate
            </Button>
            <Button
              variant="neutral"
              size="md"
              onPress={handlePlan}
              isDisabled={planning || generating || !prompt.trim()}
            >
              {planning && !generating ? <Spinner size="sm" /> : null}
              Plan
            </Button>
            <Button
              variant="ghost"
              size="md"
              onPress={() => onAuthorFix('')}
              style={{ marginLeft: 'auto' }}
            >
              + Author fix
            </Button>
          </div>

          {error && (
            <Banner.Root variant="error">
              <Banner.Title>Error</Banner.Title>
              <Banner.Description>{error}</Banner.Description>
            </Banner.Root>
          )}

          {modelError && (
            <Banner.Root variant="warning" size="sm">
              <Banner.Title>Model discovery</Banner.Title>
              <Banner.Description>{modelError}</Banner.Description>
            </Banner.Root>
          )}
        </div>
      </div>

      {/* Plan result pane */}
      <div className="studio-pane studio-pane--plan">
        <div className="studio-pane-header">
          Plan
          {planning && <Spinner size="sm" />}
        </div>
        <div className="studio-pane-body">
          {planText ? (
            <PlanResult markdown={planText} onAuthorFix={onAuthorFix} />
          ) : (
            <div className="studio-hint">
              <span>Plan results appear here</span>
            </div>
          )}
        </div>
      </div>

      {/* Preview pane */}
      <div
        className="studio-pane studio-pane--preview"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <div className="studio-pane-header">
          Preview
          {generating && <Spinner size="sm" />}
        </div>
        {generatedCode ? (
          <PreviewPane code={generatedCode} />
        ) : (
          <div className="studio-hint" style={{ flex: 1 }}>
            <span>Generated preview appears here</span>
          </div>
        )}
      </div>
    </div>
  );
}
