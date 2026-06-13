// postMessage protocol between the Studio and the sandboxed preview iframe.

export interface PreviewMessage {
  type: 'render';
  code: string; // compiled JS (from transpileTsx)
}

export interface PreviewError {
  type: 'error';
  message: string;
}

export interface PreviewReady {
  type: 'ready';
}

export type PreviewInbound = PreviewMessage;
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
