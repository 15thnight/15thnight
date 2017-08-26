import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureRoutes from 'routes';
import configureStore from 'store';

const store = configureStore();

const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router history={history} routes={configureRoutes(store)} />
    </Provider>
, document.getElementById('entry'));
