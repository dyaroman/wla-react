import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './styles/index.scss';
import { App } from './App';
import { store } from './store/store';
import { ErrorBoundary } from './components/ErrorBoundary';
import packageJson from '../package.json';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>,
);

console.log('app version:', packageJson.version);
console.log('app commit:', __APP_COMMIT__);
