import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as notifications } from 'react-notification-system-redux';
import Immutable from 'seamless-immutable';

import {
    togglePageContainer,
    clearPageScroll,
    setAlertRedirect
} from 'actions';
import {
    loginUser,
    getAlerts,
    getAlert,
    getCategories,
    getCategory,
    getNeed,
    getServices,
    getService,
    getUsers,
    getUser,
    updateProfile
} from 'api';
import { createReducer, createRequestReducer, requestReducer as request } from 'react-requests';

const PAGE_CONTAINER_INITIAL_STATE = { hidden: false, scroll: null };

const pageContainer = createReducer({
    [togglePageContainer]: (state, { hidden, scroll }) => state.merge({
        hidden, scroll: (typeof scroll === 'number') ? scroll : state.scroll
    }),
    [clearPageScroll]: () => Immutable(PAGE_CONTAINER_INITIAL_STATE)
}, Immutable(PAGE_CONTAINER_INITIAL_STATE));

const alertRedirect = createReducer({
    [setAlertRedirect]: (state, redirect) => Immutable(redirect)
}, Immutable(null));

const current_user = createRequestReducer({
    [loginUser]: {
        end: ({ data }) => Immutable(data)
    },
    [updateProfile]: {
        end: ({ data }) => Immutable(data)
    }
}, Immutable(INITIAL_STATE.current_user));

const users = createRequestReducer({
    [getUsers]: {
        start: [],
        end: ({ data }) => Immutable(data)
    }
}, Immutable([]));

const user = createRequestReducer({
    [getUser]: {
        start: ({ state, params: { id }}) => state.merge({ [id]: null }),
        end: ({ data, state }) => state.merge({ [data.id]: data })
    }
}, Immutable({}))

const categories = createRequestReducer({
    [getCategories]: {
        start: null,
        end: ({ data }) => Immutable(data)
    }
}, Immutable(null));

const category = createRequestReducer({
    [getCategory]: {
        end: ({ state, data }) => state.merge({ [data.id]: data }),
    }
}, Immutable({}));

const services = createRequestReducer({
    [getServices]: {
        start: null,
        end: ({ data }) => Immutable(data)
    }
}, Immutable(null));

const service = createRequestReducer({
    [getService]: {
        start: ({ state, params: { id }}) => state.merge({ [id]: undefined }),
        end: ({ state, data }) => state.merge({ [data.id]: data })
    }
}, Immutable({}))

const alerts = createRequestReducer({
    [getAlerts]: {
        end: ({ data }) => Immutable(data)
    }
}, Immutable([]));

const alert = createRequestReducer({
    [getAlert]: {
        start: ({ state, params: { id }}) => state.merge({ [id]: undefined }),
        end: ({ state, data }) => state.merge({ [data.id]: data }),
    }
}, Immutable({}));

const need = createRequestReducer({
    [getNeed]: {
        end: ({ state, data }) => state.merge({ [data.id]: data })
    }
}, Immutable({}));

const rootReducer = combineReducers({
    notifications,
    routing,

    current_user,
    users,
    user,
    categories,
    category,
    services,
    service,
    alerts,
    alert,
    need,
    pageContainer,
    alertRedirect,
    request,
});

export default rootReducer;
