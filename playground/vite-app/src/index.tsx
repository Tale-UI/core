import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router';
import { Home } from './Home';
import { routes } from './routes';
import ScaleDemo from './demos/ScaleDemo';
import { ThemeDrawer } from './ThemeDrawer';
import '@tale-ui/react-styles/index.css';
import './index.css';

const baseUrl = import.meta.env.BASE_URL;
const routerBase = baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '');
const scaleHashPattern =
  /^#[0-9a-fA-F]{6}\/[0-9a-fA-F]{6}\/(?:named|neutral)(?:\/[^/]+)?(?:\/named-neutral)?$/;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={routerBase}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

export function App() {
  const { pathname } = useLocation();
  const isScale = pathname === '/scale' || pathname === `${routerBase}/scale`;

  React.useEffect(() => {
    if (isScale || !scaleHashPattern.test(window.location.hash)) {
      return;
    }

    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }, [isScale]);

  return (
    <div>
      <header className="pg-header">
        <div className="pg-container pg-header-inner">
          <Link className="pg-logo" to="/">
            <img src={`${baseUrl}tale-ui-logo.svg`} alt="Tale UI logo" />
            Tale UI playground
          </Link>
          <nav className="pg-header-nav">
            <a className="pg-header-link" href="http://localhost:5174/">
              Theme Playground
            </a>
            <a className="pg-header-link" href="http://localhost:5175/">
              MCP Studio
            </a>
            <a className="pg-header-link" href="http://localhost:5176/">
              Tooling Dashboard
            </a>
            <ThemeDrawer />
            <button
              type="button"
              className="pg-header-btn"
              onClick={() => window.dispatchEvent(new Event('scale:randomize-both'))}
              title="Randomize both named and neutral colours"
            >
              Randomize theme
            </button>
            <button
              type="button"
              className="pg-header-btn"
              onClick={() => window.dispatchEvent(new Event('scale:reset'))}
              title="Reset theme to design system defaults"
            >
              Reset theme
            </button>
            <div className="pg-header-modes">
              <button
                type="button"
                className="pg-header-btn"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('scale:set-bg', { detail: 'light' }))
                }
              >
                Light
              </button>
              <button
                type="button"
                className="pg-header-btn"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('scale:set-bg', { detail: 'dark' }))
                }
              >
                Dark
              </button>
              <button
                type="button"
                className="pg-header-btn"
                onClick={() =>
                  window.dispatchEvent(new CustomEvent('scale:set-bg', { detail: 'accent' }))
                }
              >
                Accent
              </button>
            </div>
          </nav>
        </div>
      </header>
      {/* Scale app is always mounted to preserve state and global CSS effects */}
      <div style={{ display: isScale ? undefined : 'none' }}>
        <ScaleDemo syncUrlHash={isScale} />
      </div>
      <main className="pg-container pg-main" style={{ display: isScale ? 'none' : undefined }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {routes.map((entry) => {
            if (entry.type === 'route') {
              if (entry.path === '/scale') {
                return null;
              }
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
