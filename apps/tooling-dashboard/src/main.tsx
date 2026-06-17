import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';
import '@tale-ui/react-styles/index.css';
import './dashboard.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
