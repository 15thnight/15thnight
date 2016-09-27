import {
    dispatchAppError,
    dispatchFormError,
    dispatchFormSuccess,
    dispatchGetNeed
} from 'dispatch';
import { request } from 'util';


export function getNeed(id) {
    let promise = request.get('/api/v1/need/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchGetNeed(res.data));
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while getting alerts.'));
            }
        )
    }
}

export function resolveNeed(id, data) {
    let promise = request.post('/api/v1/need/' + id + '/resolve', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Need resolved successfully.'));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while getting alerts.'));
            }
        )
    }
}