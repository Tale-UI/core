import * as React from 'react';
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

export function App() {
  return (
    <div>
      <header className="pg-header">
        <div className="pg-container pg-header-inner">
          <Link className="pg-logo" to="/">
            <img src={`${baseUrl}tale-ui-logo.svg`} alt="Tale UI logo" />
            Tale UI playground
          </Link>
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
