import * as React from 'react';
import { Banner } from '@tale-ui/react/banner';
import { Button } from '@tale-ui/react/button';
import { Icon } from '@tale-ui/react/icon';
import { Code2Icon, RefreshCwIcon } from 'lucide-react';
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
  const [showCode, setShowCode] = React.useState(false);

  React.useEffect(() => {
    return onPreviewMessage(msg => {
      if (msg.type === 'ready') {
        setIframeReady(true);
      } else if (msg.type === 'error') {
        setPreviewError(msg.message ?? null);
      }
    });
  }, []);

  const renderCode = React.useCallback(async (tsx: string) => {
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
  }, []);

  React.useEffect(() => {
    if (!iframeReady) {
      return;
    }
    void renderCode(code);
  }, [code, iframeReady, renderCode]);

  return (
    <div className="recipe-preview">
      <div className="recipe-preview__toolbar">
        <Button variant="ghost" size="sm" onPress={() => void renderCode(code)}>
          <Icon icon={RefreshCwIcon} size="sm" />
          Refresh
        </Button>
        <Button variant="ghost" size="sm" onPress={() => setShowCode(value => !value)}>
          <Icon icon={Code2Icon} size="sm" />
          {showCode ? 'Show preview' : 'Show TSX'}
        </Button>
      </div>

      {transpileError && (
        <Banner.Root variant="error" className="recipe-preview__banner">
          <Banner.Title>Transpile error</Banner.Title>
          <Banner.Description className="recipe-preview__error-text">
            {transpileError}
          </Banner.Description>
        </Banner.Root>
      )}

      {showCode ? (
        <pre className="recipe-code-block">{code}</pre>
      ) : (
        <iframe
          ref={iframeRef}
          src="/src/preview/preview.html"
          className="recipe-preview__frame"
          title="Recipe preview"
          sandbox="allow-scripts allow-same-origin"
        />
      )}

      {previewError && (
        <div className="recipe-preview__runtime-error">
          {previewError}
        </div>
      )}
    </div>
  );
}
