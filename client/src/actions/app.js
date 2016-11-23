import {
    CLEAR_PAGE_SCROLL,
    CLEAR_FLASH,
    CLEAR_FORM_STATUS,
    SET_ALERT_REDIRECT,
    TOGGLE_PAGE_CONTAINER
} from 'constants';



export function togglePageContainer(hidden, scroll) {
    return {
        type: TOGGLE_PAGE_CONTAINER,
        hidden,
        scroll
    }
}

export function clearPageScroll() {
    return {
        type: CLEAR_PAGE_SCROLL
    }
}

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
