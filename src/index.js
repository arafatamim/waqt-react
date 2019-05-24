import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faSave, faTimesCircle, faRedo } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import * as serviceWorker from './serviceWorker';

library.add(faCog, faSave, faGithub, faTimesCircle, faRedo);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
