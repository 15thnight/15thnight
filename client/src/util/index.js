import axios from 'axios';
import moment from 'moment-timezone';

import { requestStarted, requestFinished, requestError } from 'actions';

export const moment_tz = dt => moment.tz(dt, moment.tz.guess())

export const format_datetime = (dt, format='LLL') => moment_tz(dt).format(format);

export const request = axios.create({
    headers: { 'X-CSRFToken': document.getElementById('csrf').content }
});

export const checkRequest = (prevRequest, { started, success, data, symbol }, apiMethod, successCallback, errorCallback) => {
    let apiMethods;
    if (!Array.isArray(apiMethod)) {
        apiMethods = [apiMethod.symbol]
    } else {
        apiMethods = apiMethod.map(({ symbol }) => symbol);
    }
    if (prevRequest.started && !started && apiMethods.includes(symbol)) {
        if (success)  {
            successCallback && successCallback(data);
        } else if (data) {
            errorCallback && errorCallback(data);
        }
        return true;
    }
    return false;
}

export const createApi = baseUrl => {
    const api = {}
    const formatUrl = (url, ...params) =>
        baseUrl + (typeof url !== 'string' ? url.apply({}, params) : url);
    const getRequestArgs = (url, params, method) =>
        [formatUrl.apply({}, [url].concat(params))]
            .concat(['post', 'put'].includes(method) && params[0])
            .filter(a => a);
    ['get', 'post', 'put', 'delete'].forEach(method => {
        api[method] = (url, successAction) => {
            const symbol = Symbol();
            const apiMethod = (...params) => dispatch => {
                const requestData = params[0];
                dispatch(requestStarted({ symbol, params, successAction, requestData }));
                request[method].apply(request, getRequestArgs(url, params, method))
                    .then(({ data }) => {
                        successAction && dispatch(successAction(data, params[0]));
                        dispatch(requestFinished({ symbol, successAction, data, requestData, params }));
                    }, ({ response }) => {
                        const data = response ? response.data : undefined;
                        dispatch(requestError({ symbol, successAction, data, requestData, params }));
                    })
            }
            apiMethod.symbol = symbol;
            return apiMethod;
        }
    });
    return api;
}

export const createAction = name => {
    const type = Symbol(name);
    const action = payload => ({ type, payload });
    action.type = type;
    action.toString = () => type;
    return action;
}

export const createReducer = (handlers, initialState) =>
    (state = initialState, { type, payload }) =>
            handlers[type] ? handlers[type](state, payload, type) : state;
