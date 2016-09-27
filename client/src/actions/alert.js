import {
    dispatchAppError,
    dispatchFormError,
    dispatchFormSuccess,
    dispatchGetAlert,
    dispatchGetAlerts
} from 'dispatch';

import { request } from 'util';


export function getAlerts(scope='') {
    if (scope) {
        scope = '?scope=' + scope;
    }
    let promise = request.get('/api/v1/alert' + scope);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchGetAlerts(res.data));
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while getting alerts.'));
            }
        )
    }
}

export function getAlert(id) {
    let promise = request.get('/api/v1/alert/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchGetAlert(res.data));
            },
            err => {
                let error = 'Unknown error occured while loading alert';
                if (err.response.data && err.response.data.error) {
                    error = 'Error occured while loading alert: ' + err.response.data.error;
                }
                dispatch(dispatchAppError(error));
            }
        )
    }
}

export function sendAlert(data) {
    let promise = request.post('/api/v1/alert', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Alert sent successfully.'));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while sending alert.'));
            }
        )
    }
}