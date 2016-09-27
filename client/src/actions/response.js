import {
    dispatchFormError,
    dispatchFormSuccess
} from 'dispatch';
import { request } from 'util';

export function sendResponse(data) {
    let promise = request.post('/api/v1/response', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSuccess('Response sent successfully.'));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while sending response.'));
            }
        )
    }
}
