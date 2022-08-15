import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './styles/index.scss';
import { App } from './App';
import { store } from './store/store';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

console.log(`app commit: ${process.env.REACT_APP_VERSION.substring(0, 8)}`);
