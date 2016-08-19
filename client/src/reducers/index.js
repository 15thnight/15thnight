import { combineReducers } from 'redux';

import {
    LOGIN_USER, LOGOUT_USER, UPDATE_USER,
    GET_USERS, GET_USER, GET_USER_ERROR,
    SUBMIT_FORM_SUCCESS, SUBMIT_FORM_ERROR, CLEAR_FORM_STATUS,
    GET_ALERTS, GET_ALERT, GET_ALERT_ERROR,
    GETTING_CATEGORIES, GET_CATEGORIES, GET_CATEGORY, GET_CATEGORY_ERROR,
    GETTING_SERVICES, GET_SERVICES, GET_SERVICE, GET_SERVICE_ERROR,
    CLEAR_FLASH, APP_ERROR
} from 'constants';

function current_user(state = INITIAL_STATE.current_user, action) {
    switch (action.type) {
        case LOGIN_USER:
        case UPDATE_USER:
            return action.current_user
        case LOGOUT_USER:
            return null;
        default:
            return state;
    }
}

function users(state = [], action) {
    switch (action.type) {
        case GET_USERS:
            return action.users;
        case LOGOUT_USER:
            return [];
        default:
            return state;
    }
}

function user(state = {}, action) {
    switch (action.type) {
        case GET_USER:
            return {[action.id]: action.user};
        case GET_USER_ERROR:
            return {[action.id]: action.error};
        default:
            return state;
    }
}

let flash_counter = 0;
function flash(state = [], action) {
    switch (action.type) {
        case SUBMIT_FORM_SUCCESS:
            state.push({
                message: action.message,
                type: 'success',
                id: flash_counter++
            });
            return state.slice(0);
        case APP_ERROR:
            state.push({
                message: action.message,
                type: 'danger',
                id: flash_counter++
            });
            return state.slice(0);
        case CLEAR_FLASH:
            return state.filter(flash => {
                return flash.id !== action.id;
            }).slice(0);
    }
    return state;
}

function categories(state = null, action) {
    switch (action.type) {
        case GET_CATEGORIES:
            return action.categories;
        case GETTING_CATEGORIES:
            return null;
        default:
            return state;
    }
}

function category(state = {}, action) {
    switch (action.type) {
        case GET_CATEGORY:
            return {[action.id]: action.category};
        case GET_CATEGORY_ERROR:
            return {[action.id]: action.error};
        default:
            return state;
    }
}

function services(state = null, action) {
    switch (action.type) {
        case GET_SERVICES:
            return action.categories;
        case GETTING_SERVICES:
            return null;
        default:
            return state;
    }
}

function service(state = {}, action) {
    switch (action.type) {
        case GET_SERVICE:
            return {[action.id]: action.category};
        case GET_SERVICE_ERROR:
            return {[action.id]: action.error};
        default:
            return state;
    }
}


function alerts(state = [], action) {
    switch (action.type) {
        case GET_ALERTS:
            return action.alerts;
        case LOGOUT_USER:
            return [];
        default:
            return state;
    }
}

function alert(state = {}, action) {
    switch (action.type) {
        case GET_ALERT:
            return {[action.id]: action.alert};
        case GET_ALERT_ERROR:
            return {[action.id]: action.error};
        default:
            return state;
    }
}

function submitFormError(state = null, action) {
    switch (action.type) {
        case SUBMIT_FORM_ERROR:
            return action.error;
        case CLEAR_FORM_STATUS:
            return null;
        default:
            return state;
    }
}

function submitFormSuccess(state = null, action) {
    switch(action.type) {
        case SUBMIT_FORM_SUCCESS:
            return true;
        case CLEAR_FORM_STATUS:
            return null;
        default:
            return state;
    }
}

const rootReducer = combineReducers({
    current_user,
    users,
    user,
    categories,
    category,
    services,
    service,
    alerts,
    alert,
    flash,
    submitFormSuccess,
    submitFormError
});

export default rootReducer;