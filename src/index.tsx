import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core';

import App from './components/app';
import * as serviceWorker from './serviceWorker';
import { configureAmplify, configureStore, configureTheme } from './config';
import './styles/index.scss';

configureAmplify();

const store = configureStore();
const theme = configureTheme();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
