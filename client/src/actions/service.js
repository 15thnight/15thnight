import {
    dispatchAppError,
    dispatchFormError,
    dispatchFormSuccess,
    dispatchGetService,
    dispatchGetServices
} from 'dispatch';
import { request } from 'util';


export function getServices() {
    let promise = request.get('/api/v1/service');
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchGetServices(res.data));
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while getting services.'));
            }
        )
    }
}

export function getService(id) {
    let promise = request.get('/api/v1/service/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchGetService(res.data));
            },
            err => {
                dispatch(dispatchFormError(err, 'An error occured fetching service list.'));
            }
        )
    }
}

export function createService(data) {
    let promise = request.post('/api/v1/service', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Successfully created service'));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while creating service.'));
            }
        );
    }
}

export function editService(id, data) {
    let promise = request.put('/api/v1/service/' + id, data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Successfully updated service.'));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while editing service.'));
            }
        );
    }
}

export function deleteService(id) {
    let promise = request.delete('/api/v1/service/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Successfully deleted service.'));
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while deleting service.'));
            }
        );
    }
}