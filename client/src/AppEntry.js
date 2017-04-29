import { Promise } from 'es6-promise/auto';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import 'lib/bootstrap3/dist/css/bootstrap.min.css';

import 'polyfill/Array.filter';
import 'polyfill/Array.indexOf';
import 'polyfill/Array.map';
import 'polyfill/Array.reduce';

import configureRoutes from './routes';
import Chrome from 'components/chrome';
import configureStore from 'store/Store';

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router history={history} routes={configureRoutes(store)} />
    </Provider>
, document.getElementById('entry'));
