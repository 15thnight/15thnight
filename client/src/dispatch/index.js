import {
    LOGIN_USER, LOGOUT_USER, UPDATE_USER,
    GET_USERS, GET_USER, GET_USER_ERROR,
    SUBMIT_FORM_SUCCESS, SUBMIT_FORM_ERROR, CLEAR_FORM_STATUS,
    GET_ALERTS, GET_ALERT, GET_ALERT_ERROR, SET_ALERT_REDIRECT,
    GET_NEED,
    GETTING_CATEGORIES, GET_CATEGORIES, GET_CATEGORY,
    GET_SERVICE, GET_SERVICES,
    CLEAR_FLASH, APP_ERROR
} from 'constants';


export function dispatchAppError(message) {
    return {
        type: APP_ERROR,
        message
    }
}

export function dispatchFormError(err, message, errType=SUBMIT_FORM_ERROR) {
    if (err.response.data && err.response.data.error) {
        return {
            type: errType,
            error: err.response.data.error
        };
    }
    return dispatchAppError(message)
}

export function dispatchFormSuccess(message) {
    return {
        type: SUBMIT_FORM_SUCCESS,
        message
    }
}

export function dispatchGetAlerts(alerts) {
    return {
        type: GET_ALERTS,
        alerts
    }
}

export function dispatchGetAlert(alert) {
    return {
        type: GET_ALERT,
        alert
    }
}

export function dispatchGetNeed(need) {
    return {
        type: GET_NEED,
        need
    }
}

export function dispatchGetCategories(categories) {
    return {
        type: GET_CATEGORIES,
        categories
    }
}

export function dispatchGetCategory(category) {
    return {
        type: GET_CATEGORY,
        id: category.id,
        category
    }
}

export function dispatchGetServices(services) {
    return {
        type: GET_SERVICES,
        services
    }
}

export function dispatchGetService(service) {
    return {
        type: GET_SERVICE,
        id: service.id,
        service
    }
}

export function dispatchGetUsers(users) {
    return {
        type: GET_USERS,
        users
    }
}

export function dispatchGetUser(user) {
    return {
        type: GET_USER,
        id: user.id,
        user
    }
}

export function dispatchLoginUser(current_user) {
    return {
        type: LOGIN_USER,
        current_user
    }
}

export function dispatchLogoutUser() {
    return {
        type: LOGOUT_USER
    }
}

export function dispatchUpdateUser(current_user) {
    return {
        type: UPDATE_USER,
        current_user
    }
}