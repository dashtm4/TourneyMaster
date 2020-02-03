import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import configureAmplify from './config/configureAmplify';
import './styles/index.scss';

configureAmplify();

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorker.unregister();
