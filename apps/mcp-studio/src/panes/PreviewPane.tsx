import * as React from 'react';
import { Banner } from '@tale-ui/react/banner';
import { Button } from '@tale-ui/react/button';
import { transpileTsx } from '../lib/transpile';
import { sendToPreview, onPreviewMessage } from '../lib/preview-host';

interface PreviewPaneProps {
  code: string;
}

export function PreviewPane({ code }: PreviewPaneProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = React.useState(false);
  const [transpileError, setTranspileError] = React.useState<string | null>(null);
  const [previewError, setPreviewError] = React.useState<string | null>(null);
  const [rawCode, setRawCode] = React.useState(code);
  const [showRaw, setShowRaw] = React.useState(false);

  // Listen for messages from the iframe
  React.useEffect(() => {
    return onPreviewMessage(msg => {
      if (msg.type === 'ready') {
        setIframeReady(true);
      } else if (msg.type === 'error') {
        setPreviewError(msg.message ?? null);
      }
    });
  }, []);

  // Whenever code changes or iframe becomes ready, transpile and render
  React.useEffect(() => {
    setRawCode(code);
    if (!iframeReady) {return;}
    void renderCode(code);
   
  }, [code, iframeReady]);

  async function renderCode(tsx: string) {
    setTranspileError(null);
    setPreviewError(null);
    const result = await transpileTsx(tsx);
    if ('error' in result) {
      setTranspileError(result.error ?? null);
      return;
    }
    if (iframeRef.current) {
      sendToPreview(iframeRef.current, { type: 'render', code: result.code });
    }
  }

  // Sync color mode to the preview iframe
  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      const mode = document.documentElement.getAttribute('data-color-mode') ?? 'light';
      iframeRef.current?.contentWindow?.postMessage({ type: 'color-mode', mode }, '*');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-mode'] });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 'var(--space-xs)', padding: 'var(--space-xs) var(--space-m)', borderBottom: '1px solid var(--neutral-20)', flexShrink: 0, alignItems: 'center' }}>
        <Button variant="ghost" size="sm" onPress={() => void renderCode(rawCode)}>Refresh</Button>
        <Button variant="ghost" size="sm" onPress={() => setShowRaw(r => !r)}>
          {showRaw ? 'Show preview' : 'Show code'}
        </Button>
      </div>

      {transpileError && (
        <Banner.Root variant="error" style={{ margin: 'var(--space-s)', flexShrink: 0 }}>
          <Banner.Title>Transpile error</Banner.Title>
          <Banner.Description style={{ fontFamily: 'monospace', fontSize: 'var(--text-xs-font-size)', whiteSpace: 'pre-wrap' }}>
            {transpileError}
          </Banner.Description>
        </Banner.Root>
      )}

      {showRaw ? (
        <pre style={{ flex: 1, overflow: 'auto', padding: 'var(--space-m)', fontSize: 'var(--text-xs-font-size)', margin: 0 }}>
          {rawCode}
        </pre>
      ) : (
        <iframe
          ref={iframeRef}
          src="/src/preview/preview.html"
          className="preview-frame"
          title="Component preview"
          sandbox="allow-scripts allow-same-origin"
          style={{ flex: 1 }}
        />
      )}

      {previewError && (
        <div className="preview-error" style={{ flexShrink: 0, maxHeight: '12.5rem', overflow: 'auto' }}>
          {previewError}
        </div>
      )}
    </div>
  );
}
