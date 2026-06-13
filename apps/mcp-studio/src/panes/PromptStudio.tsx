import * as React from 'react';
import { Button } from '@tale-ui/react/button';
import { TextArea } from '@tale-ui/react/text-area';
import { Select } from '@tale-ui/react/select';
import { Spinner } from '@tale-ui/react/spinner';
import { Banner } from '@tale-ui/react/banner';
import { apiPlanUi, apiGenerate, type GoldenPrompt } from '../lib/api';
import { PlanResult } from './PlanResult';
import { PreviewPane } from './PreviewPane';

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

  React.useEffect(() => {
    fetch('/api/golden-prompts')
      .then(r => r.json())
      .then(prompts => setGoldens(prompts as GoldenPrompt[]))
      .catch(() => { /* golden prompts are optional */ });
  }, []);

  const handlePlan = React.useCallback(async () => {
    if (!prompt.trim()) {return;}
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
    if (!prompt.trim()) {return;}
    setError(null);
    // Run plan and generate in parallel
    setPlanning(true);
    setGenerating(true);
    setPlanText(null);
    setGeneratedCode(null);
    try {
      const [planResult, genResult] = await Promise.allSettled([
        apiPlanUi(prompt.trim()),
        apiGenerate(prompt.trim()),
      ]);
      if (planResult.status === 'fulfilled') {setPlanText(planResult.value);}
      if (genResult.status === 'fulfilled') {setGeneratedCode(genResult.value);}
      const err = planResult.status === 'rejected' ? planResult.reason : genResult.status === 'rejected' ? genResult.reason : null;
      if (err) {setError(err instanceof Error ? err.message : String(err));}
    } finally {
      setPlanning(false);
      setGenerating(false);
    }
  }, [prompt]);

  return (
    <div className="studio-panes">
      {/* Prompt pane */}
      <div className="studio-pane studio-pane--prompt">
        <div className="studio-pane-header">Prompt</div>
        <div className="studio-pane-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
          {goldens.length > 0 && (
            <Select.Root
              placeholder="Load a golden prompt…"
              onSelectionChange={key => {
                const g = goldens.find(x => x.slug === key);
                if (g) {setPrompt(g.prompt);}
              }}
            >
              <Select.Label>Golden prompts</Select.Label>
              <Select.Trigger />
              <Select.Popover>
                <Select.ListBox>
                  {goldens.map(g => (
                    <Select.Item key={g.slug} id={g.slug}>
                      [{g.difficulty}] {g.slug}
                    </Select.Item>
                  ))}
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
          )}

          <TextArea.Root value={prompt} onChange={setPrompt}>
            <TextArea.Label className="sr-only">UI prompt</TextArea.Label>
            <TextArea.TextArea
              placeholder="Describe the UI you want to build…"
              style={{ minHeight: '14rem', fontFamily: 'inherit' }}
            />
          </TextArea.Root>

          <div style={{ display: 'flex', gap: 'var(--space-s)', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="md"
              onPress={handleGenerate}
              isDisabled={planning || generating || !prompt.trim()}
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
      <div className="studio-pane studio-pane--preview" style={{ display: 'flex', flexDirection: 'column' }}>
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
