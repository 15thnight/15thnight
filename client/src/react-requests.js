import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Immutable from 'seamless-immutable';


export const withRequests = ComposedComponent => {
    class RequestObserver extends React.Component {
        observations= [];
        componentWillReceiveProps({ request }) {
            this.observations.forEach(({ match, callbacks }) =>
                checkRequest(this.props.request, request, match, callbacks));

        }

        observeRequest = (match, callbacks) => this.observations.push({ match, callbacks });

        render() {
            return <ComposedComponent observeRequest={this.observeRequest} {...this.props} />;
        }
    }
    return connect(({ request }) => ({ request }))(RequestObserver)
}

export const request = axios.create({
   headers: { 'X-CSRFToken': document.getElementById('csrf').content }
});

export const checkRequest = (prevRequest, { started, success, data, symbol }, apiMethod, callbacks) => {
    const apiMethods = [].concat(apiMethod).map(a => a.toString());
    if (apiMethods.includes(symbol)) {
        callbacks.every && callbacks.every();
        if (!prevRequest.started && started) {
            callbacks.start && callbacks.start();
        } else if (prevRequest.started && !started) {
            if (success)  {
                callbacks.end && callbacks.end(data);
            } else if (data) {
                callbacks.error && callbacks.error(data);
            }
            callbacks.finally && callbacks.finally();
        }
        return true;
    }
    return false;
}

export const createAction = type => {
    const action = payload => ({ type, payload });
    action.type = type;
    action.toString = () => type;
    return action;
}

const requestStarted = createAction('REQUEST_STARTED');
const requestFinished = createAction('REQUEST_FINISHED');
const requestError = createAction('REQUEST_ERROR');

const methods = ['get', 'head', 'post', 'put', 'delete'];

export const createApi = (baseUrl='', options={}) => methods.reduce((api, method) => {
    api[method] = url => {
        const symbol = `${method.toUpperCase()}: ${typeof url !== 'string' ? url({}).replace('undefined', '{}') : url}`;
        const apiMethod = (params={}) => dispatch => {
            const requestData = params.data;
            const requestUrl = baseUrl + (typeof url !== 'string' ? url(params) : url);
            const requestId = Symbol(`${method.toUpperCase()} [${new Date().toLocaleString()}]: ${requestUrl}`);
            const requestArgs = [requestUrl];
            if (('post' === method || 'put' === method) && requestData) {
                requestArgs.push(requestData);
            }
            dispatch(requestStarted({ requestId, symbol, params, requestData }));
            request[method].apply(request, requestArgs).then(
                ({ data }) => dispatch(requestFinished({ requestId, symbol, data, requestData, params })),
                ({ response={} }) => dispatch(requestError({ requestId, symbol, data: response.data, requestData, params }))
            );
            return requestId;
        }
        apiMethod.symbol = symbol;
        apiMethod.toString = () => symbol;
        return apiMethod;
    }
    return api;
}, {});

export const createReducer = (handlers, initialState) =>
    (state = initialState, { type, payload }) =>
            handlers[type] ? handlers[type](state, payload, type) : state;

export const requestReducer = createReducer({
    [requestStarted]: (state, { symbol, successAction, requestData }) =>
        state.merge({
            started: true,
            success: undefined,
            data: undefined,
            symbol, successAction, requestData
        }),
    [requestFinished]: (state, { symbol, successAction, data, requestData }) =>
        state.merge({
            started: false,
            success: true,
            symbol, successAction, data, requestData
        }),
    [requestError]: (state, { symbol, successAction, data, requestData }) =>
        state.merge({
            started: false,
            success: false,
            symbol, successAction, data, requestData
        })
}, Immutable({ started: false, error: false, success: false, symbol: null }));

const typeMap = {
    [requestStarted]: 'start',
    [requestFinished]: 'end',
    [requestError]: 'error'
}

export const handleRequest = (newState) => (state, { symbol, data, params }) =>
    //symbol === apiMethod.symbol ? processRequest({ newState, state, data, params }) : state;
    typeof newState === 'function' ? newState({ data, params, state }) : Immutable(newState);

export const createRequestReducer = (handlers, initialState) =>
    (state=initialState, { type, payload }) =>
        typeMap[type] &&
        handlers[payload.symbol] &&
        handlers[payload.symbol][typeMap[type]]
            ? handleRequest(handlers[payload.symbol][typeMap[type]])(state, payload)
            : state;
