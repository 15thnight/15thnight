import {
    dispatchAppError,
    dispatchFormError,
    dispatchFormSuccess,
    dispatchGetUser,
    dispatchGetUsers
} from 'dispatch';
import { request } from 'util';


export function getUsers() {
    let promise = request.get('/api/v1/user');
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchGetUsers(res.data));
            },
            err => {
                dispatch(dispatchAppError('An error occured fetching user list.'));
            }
        )
    }
}

export function getUser(id) {
    let promise = request.get('/api/v1/user/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchGetUser(res.data));
            },
            err => {
                dispatch(dispatchAppError('An error occured fetching user data.'));
            }
        )
    }
}

export function createUser(data) {
    let promise = request.post('/api/v1/user', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Successfully created user.'));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while creating user.'));
            });
    }
}

export function editUser(id, data) {
    let promise = request.put('/api/v1/user/' + id, data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Successfully updated user.'));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while creating user.'));
            });
    }
}

export function deleteUser(id) {
    let promise = request.delete('/api/v1/user/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Successfully deleted user.'));
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while deleting user.'));
            });
    }
}