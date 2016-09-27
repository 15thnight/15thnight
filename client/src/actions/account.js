import {
    dispatchAppError,
    dispatchFormError,
    dispatchFormSuccess,
    dispatchLoginUser,
    dispatchLogoutUser,
    dispatchUpdateUser
} from 'dispatch';

import { request } from 'util';


export function getCurrentUser(data) {
    let promise = request.get('/api/v1/current_user?'+ new Date().getTime());
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchLoginUser(res.data.current_user));
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while getting user info.'));
            }
        );
    }
}


export function loginUser(data) {
    let promise = request.post('/api/v1/login', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchLoginUser(res.data));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while logging in.'));
            });
    }
}

export function logoutUser() {
    let promise = request.post('/api/v1/logout');
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchLogoutUser());
                //request = request_factory(res.data.csrf_token);
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while logging out.'));
            }
        )
    }
}
export function changePassword(data) {
    let promise = request.post('/api/v1/change-password', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Successfully changed password.'))
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while changing password.'));
            }
        )
    }
}

export function updateProfile(data) {
    let promise = request.post('/api/v1/update-profile', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Successfully updated profile.'))
                dispatch(dispatchUpdateUser(res.data));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while updating profile.'));
            }
        )
    }
}

export function forgotPassword(data) {
    let promise = request.post('/api/v1/forgot-password', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('If an email was found at that address, a password reset email has been sent.'))
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while sending password reset email.'));
            }
        )
    }
}

export function resetPassword(data) {
    let promise = request.post('/api/v1/reset-password', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Password reset successfully.'))
                dispatch(dispatchUpdateUser(res.data));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while resetting password.'));
            }
        )
    }
}