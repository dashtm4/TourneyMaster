import React from 'react';
import ReactDOM from 'react-dom';
<<<<<<< HEAD
import App from './components/app';
=======
import { Provider } from 'react-redux';

import App from './components/App';
>>>>>>> development
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
