export interface PreviewMessage {
  type: 'render';
  code: string;
}

export interface PreviewColorModeMessage {
  type: 'color-mode';
  mode: 'light' | 'dark';
}

export interface PreviewError {
  type: 'error';
  message: string;
}

export interface PreviewReady {
  type: 'ready';
}

export type PreviewInbound = PreviewMessage | PreviewColorModeMessage;
export type PreviewOutbound = PreviewError | PreviewReady;

export function sendToPreview(iframe: HTMLIFrameElement, msg: PreviewInbound) {
  iframe.contentWindow?.postMessage(msg, '*');
}

export function onPreviewMessage(handler: (msg: PreviewOutbound) => void): () => void {
  const listener = (event: MessageEvent) => {
    if (event.data && typeof event.data.type === 'string') {
      handler(event.data as PreviewOutbound);
    }
  };
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}
