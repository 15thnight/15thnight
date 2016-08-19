import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';
import { render }from 'react-dom';

import 'lib/bootstrap3/dist/css/bootstrap.min.css';

import configureRoutes from './ConfigureRoutes';
import Chrome from 'components/chrome';
import configureStore from 'store/Store';

import 'style/bootstrap.theme'

const store = configureStore();

const routes = configureRoutes(store)

render(
    <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
    </Provider>
, document.getElementById('entry'));