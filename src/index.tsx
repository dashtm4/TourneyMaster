import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './components/app';
import * as serviceWorker from './serviceWorker';
import { configureAmplify, configureStore } from './config';
import './styles/index.scss';

configureAmplify();

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
