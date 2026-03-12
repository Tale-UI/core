import * as React from 'react';
import { useState, useCallback } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router';
import { Home } from './Home';
import { routes } from './routes';
import '@tale-ui/react-styles/index.css';
import './index.css';

const baseUrl = import.meta.env.BASE_URL;
const routerBase = baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

function useColorMode() {
  const [mode, setMode] = useState<'light' | 'dark'>(
    () => (document.documentElement.getAttribute('data-color-mode') as 'light' | 'dark') ?? 'light'
  );

  const toggle = useCallback(() => {
    const next = mode === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-color-mode', next);
    localStorage.setItem('pg-color-mode', next);
    setMode(next);
  }, [mode]);

  return { mode, toggle };
}

export function App() {
  const { mode, toggle } = useColorMode();

  return (
    <div>
      <header className="pg-header">
        <div className="pg-container pg-header-inner">
          <Link className="pg-logo" to="/">
            <img src={`${baseUrl}tale-ui-logo.svg`} alt="Tale UI logo" />
            Tale UI playground
          </Link>
          <button
            className="pg-color-mode-toggle"
            onClick={toggle}
            aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {mode === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>
      <main className="pg-container pg-main">
        <Routes>
          <Route path="/" element={<Home />} />
          {routes.map((entry) => {
            if (entry.type === 'route') {
              return <Route key={entry.path} path={entry.path} element={entry.element} />;
            }

            if (entry.type === 'redirect') {
              return (
                <Route
                  key={entry.path}
                  path={entry.path}
                  element={<Navigate replace to={entry.to} />}
                />
              );
            }

            return null;
          })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}>
      <h1>Not found</h1>
      <p>
        This page doesn&apos;t exist.{' '}
        <Link to="/" style={{ textDecoration: 'underline' }}>
          Go home
        </Link>
        .
      </p>
    </div>
  );
}
