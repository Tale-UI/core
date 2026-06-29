import * as React from 'react';
import ScaleApp from '@tale-ui/playground-scale/App';

/**
 * Applies the same html/body styles that the standalone Scale app gets from
 * its index.css. These are injected via useEffect so they apply within
 * Storybook's preview iframe without needing a separate CSS import.
 */
export function ScalePage() {
  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // html { font-size: 100% } — standard browser rem base used by @tale-ui/core
    const prevFontSize = html.style.fontSize;
    const prevHeight = html.style.height;
    html.style.fontSize = '100%';
    html.style.height = '100%';

    // body styles matching the standalone Scale app
    const prevBodyStyles = {
      margin: body.style.margin,
      padding: body.style.padding,
      fontFamily: body.style.fontFamily,
      color: body.style.color,
      backgroundColor: body.style.backgroundColor,
      fontSize: body.style.fontSize,
      lineHeight: body.style.lineHeight,
      height: body.style.height,
      boxSizing: body.style.boxSizing,
    };

    body.style.margin = '0';
    body.style.padding = '0';
    body.style.fontFamily = 'var(--text-font-family)';
    body.style.color = 'var(--text-color)';
    body.style.backgroundColor = 'var(--neutral-5)';
    body.style.fontSize = 'var(--text-m-font-size)';
    body.style.lineHeight = 'var(--text-line-height)';
    body.style.height = '100%';

    // box-sizing reset
    const style = document.createElement('style');
    style.id = 'scale-page-styles';
    style.textContent = `
      *, *:before, *:after { box-sizing: border-box; }
      body {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: "tnum";
      }
    `;
    document.head.appendChild(style);

    return () => {
      html.style.fontSize = prevFontSize;
      html.style.height = prevHeight;
      Object.assign(body.style, prevBodyStyles);
      style.remove();
    };
  }, []);

  return (
    <div data-scale-app="" className="sb-unstyled">
      <ScaleApp />
    </div>
  );
}
