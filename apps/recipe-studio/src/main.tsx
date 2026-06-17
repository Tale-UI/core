import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import '@tale-ui/react-styles/index.css';
import './recipe-studio.css';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
