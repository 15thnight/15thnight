import {
    CLEAR_FLASH,
    CLEAR_FORM_STATUS,
    SET_ALERT_REDIRECT
} from 'constants';


export function setAlertRedirect(alertRedirect) {
    return {
        type: SET_ALERT_REDIRECT,
        alertRedirect
    }
}

export function clearFlash(id) {
    return {
        type: CLEAR_FLASH,
        id: id
    }
}

export function clearFormStatus() {
    return {
        type: CLEAR_FORM_STATUS
    }
}
