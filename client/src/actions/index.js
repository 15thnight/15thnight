import axios from 'axios';

import {
    LOGIN_USER, LOGOUT_USER,
    GET_USERS, GET_USER, GET_USER_ERROR,
    SUBMIT_FORM_SUCCESS, SUBMIT_FORM_ERROR, CLEAR_FORM_STATUS,
    GET_ALERTS, GET_ALERT, GET_ALERT_ERROR,
    GETTING_CATEGORIES, GET_CATEGORIES, GET_CATEGORY, GET_CATEGORY_ERROR,
    CLEAR_FLASH, APP_ERROR
} from 'constants';

const request_factory = csrfToken => {
    return axios.create({
        headers: { 'X-CSRFToken': csrfToken }
    });
}

let request = request_factory(document.getElementById('csrf').content);

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
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while logging in.'
                });
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
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while logging out.'
                });
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
                dispatch({
                    type: APP_ERROR,
                    message: 'An error occured fetching user list.'
                });
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
                    id: id,
                    user: res.data
                });
            },
            err => {
                if (err.response.data && err.response.data.error) {
                    return dispatch({
                        type: GET_USER_ERROR,
                        error: err.response.data.error
                    })
                }
                dispatch({
                    type: APP_ERROR,
                    message: 'An error occured fetching user list.'
                });
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
                if (err.response.data && err.response.data.error) {
                    return dispatch({
                        type: SUBMIT_FORM_ERROR,
                        error: err.response.data.error
                    });
                }
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while creating user.'
                });
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
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while creating user.'
                })
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
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while deleting user.'
                })
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
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while getting alerts.'
                })
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
                if (err.response.data && err.response.data.error) {
                    return dispatch({
                        type: GET_CATEGORY_ERROR,
                        error: err.response.data.error
                    })
                }
                dispatch({
                    type: APP_ERROR,
                    message: 'An error occured fetching user list.'
                });
            }
        )
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
                if (err.response.data && err.response.data.error) {
                    return dispatch({
                        type: SUBMIT_FORM_ERROR,
                        error: err.response.data.error
                    });
                }
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while creating category.'
                });
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
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while creating category.'
                })
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
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while deleting category.'
                })
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
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while getting alerts.'
                })
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
                    id: res.data.id,
                    alert: res.data
                });
            },
            err => {
                if (err.response.data && err.response.data.error) {
                    return dispatch({
                        type: GET_ALERT_ERROR,
                        error: err.response.data.error
                    })
                }
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while getting alerts.'
                })
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
                    message: 'Successfully sent alert.'
                });
            },
            err => {
                if (err.response.data && err.response.data.error) {
                    return dispatch({
                        type: SUBMIT_FORM_ERROR,
                        error: err.response.data.error
                    });
                }
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while sending alert.'
                })
            }
        )
    }
}

export function sendResponse(data) {
    let promise = request.post('/api/v1/response', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch({
                    type: SUBMIT_FORM_SUCCESS,
                    message: 'Successfully sent response.'
                });
            },
            err => {
                if (err.response.data && err.response.data.error) {
                    return dispatch({
                        type: SUBMIT_FORM_ERROR,
                        error: err.response.data.error
                    });
                }
                dispatch({
                    type: APP_ERROR,
                    message: 'An unknown error occured while sending response.'
                })
            }
        )
    }
}

export function clearFlash(id) {
    return {
        type: CLEAR_FLASH,
        id: id
    }
}