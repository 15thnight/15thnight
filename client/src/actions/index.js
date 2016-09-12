import axios from 'axios';

import {
    LOGIN_USER, LOGOUT_USER, UPDATE_USER,
    GET_USERS, GET_USER, GET_USER_ERROR,
    SUBMIT_FORM_SUCCESS, SUBMIT_FORM_ERROR, CLEAR_FORM_STATUS,
    GET_ALERTS, GET_ALERT, GET_ALERT_ERROR, SET_ALERT_REDIRECT,
    GETTING_CATEGORIES, GET_CATEGORIES, GET_CATEGORY,
    GET_SERVICE, GET_SERVICES,
    CLEAR_FLASH, APP_ERROR
} from 'constants';

const request_factory = csrfToken => {
    return axios.create({
        headers: { 'X-CSRFToken': csrfToken }
    });
}

let request = request_factory(document.getElementById('csrf').content);

function dispatchAppError(message) {
    return {
        type: APP_ERROR
    }
}

function dispatchFormError(err, message, errType=SUBMIT_FORM_ERROR) {
    if (err.response.data && err.response.data.error) {
        return {
            type: errType,
            error: err.response.data.error
        };
    }
    return dispatchAppError(message)
}

export function getCurrentUser(data) {
    let promise = request.get('/api/v1/current_user?'+ new Date().getTime());
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: LOGIN_USER,
                    current_user: res.data.current_user
                });
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
                dispatch({
                    type: LOGIN_USER,
                    current_user: res.data
                });
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
                dispatch({
                    type: LOGOUT_USER
                });
                request = request_factory(res.data.csrf_token);
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while logging out.'));
            }
        )
    }
}

export function getUsers() {
    let promise = request.get('/api/v1/user');
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: GET_USERS,
                    users: res.data
                });
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
                dispatch({
                    type: GET_USER,
                    id,
                    user: res.data
                });
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
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully created user.'
                });
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
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully updated user.'
                });
            },
            err => {
                // TODO: duplicate code here, simplify
                if (err.response.data && err.response.data.error) {
                    return dispatch({
                        type: SUBMIT_FORM_ERROR,
                        error: err.response.data.error
                    });
                }
                dispatch(dispatchAppError('An unknown error occured while creating user.'));
            });
    }
}

export function deleteUser(id) {
    let promise = request.delete('/api/v1/user/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully deleted user.'
                })
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while deleting user.'));
            });
    }
}

export function clearFormStatus() {
    return {
        type: CLEAR_FORM_STATUS
    }
}

export function getCategories() {
    let promise = request.get('/api/v1/category');
    return dispatch => {
        dispatch({type: GETTING_CATEGORIES });
        promise.then(
            res => {
                dispatch({
                    type: GET_CATEGORIES,
                    categories: res.data
                });
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while getting alerts.'));
            }
        )
    }
}

export function getCategory(id) {
    let promise = request.get('/api/v1/category/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: GET_CATEGORY,
                    id: id,
                    category: res.data
                });
            },
            err => {
                dispatch(dispatchFormError(err, 'An error occured fetching user list.'));
            }
        )
    }
}

export function setCategorySort(data) {
    let promise = request.put('/api/v1/category/sort_order', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: GET_CATEGORIES,
                    categories: res.data
                })
            },
            err => {
                dispatch(dispatchAppError('An error occured while sorting category list.'));
            });
    }

}

export function createCategory(data) {
    let promise = request.post('/api/v1/category', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully created category'
                });
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while creating category.'));
            });
    }
}

export function editCategory(id, data) {
    let promise = request.put('/api/v1/category/' + id, data);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully updated category.'
                })
            },
            err => {
                // TODO: duplicate code here, simplify
                if (err.response.data && err.response.data.error) {
                    return dispatch({
                        type: SUBMIT_FORM_ERROR,
                        error: err.response.data.error
                    });
                }
                dispatch(dispatchAppError('An unknown error occured while creating category.'));
            });
    }
}

export function deleteCategory(id) {
    let promise = request.delete('/api/v1/category/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully deleted category.'
                });
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while deleting category.'));
            });
    }
}

export function getAlerts() {
    let promise = request.get('/api/v1/alert');
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: GET_ALERTS,
                    alerts: res.data
                });
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
                dispatch({
                    type: GET_ALERT,
                    alert: res.data
                });
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while getting alerts.'));
            }
        )
    }
}

export function sendAlert(data) {
    let promise = request.post('/api/v1/alert', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Alert sent successfully.'
                });
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while sending alert.'));
            }
        )
    }
}

export function resolveAlertNeed(alertId, needId) {
    return dispatch => {
        request
            .post('/api/v1/alert/' + alertId + '/resolve/' + needId)
            .then(
                res => {
                    dispatch({
                        type: GET_ALERT,
                        alert: res.data
                    })
                },
                err => {
                    // TODO
                }
            )
    }
}

export function setAlertRedirect(alertRedirect) {
    return {
        type: SET_ALERT_REDIRECT,
        alertRedirect
    }
}

export function sendResponse(data) {
    let promise = request.post('/api/v1/response', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Response sent successfully.'
                });
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while sending response.'));
            }
        )
    }
}

export function changePassword(data) {
    let promise = request.post('/api/v1/change-password', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully changed password.'
                });
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
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully updated profile.'
                });
                dispatch({
                    type: UPDATE_USER,
                    current_user: res.data
                })
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
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'If an email was found at that address, a password reset email has been sent.'
                });
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
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Password reset successfully.'
                });
                dispatch({
                    type: UPDATE_USER,
                    current_user: res.data
                });
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while resetting password.'));
            }
        )
    }
}

export function getServices() {
    let promise = request.get('/api/v1/service');
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: GET_SERVICES,
                    categories: res.data
                });
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
                dispatch({
                    type: GET_SERVICE,
                    id: id,
                    category: res.data
                });
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
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully created service'
                });
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while creating service.'));
            });
    }
}

export function editService(id, data) {
    let promise = request.put('/api/v1/service/' + id, data);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully updated service.'
                })
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while editing service.'));
            });
    }
}

export function deleteService(id) {
    let promise = request.delete('/api/v1/service/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully deleted service.'
                });
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while deleting service.'));
            });
    }
}


export function clearFlash(id) {
    return {
        type: CLEAR_FLASH,
        id: id
    }
}
