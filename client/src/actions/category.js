import {
    dispatchAppError,
    dispatchFormError,
    dispatchFormSucces,
    dispatchGetCategories,
    dispatchGetCategory
} from 'dispatch';
import { request } from 'util';


export function getCategories() {
    let promise = request.get('/api/v1/category');
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchGetCategories(res.data));
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
                dispatch(dispatchGetCategory(res.data));
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
                dispatch(dispatchGetCategories(res.data));
            },
            err => {
                dispatch(dispatchAppError('An error occured while sorting category list.'));
            }
        );
    }

}

export function createCategory(data) {
    let promise = request.post('/api/v1/category', data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSucces('Successfully created category'));
            },
            err => {
                dispatch(dispatchFormError(err, 'An unknown error occured while creating category.'));
            }
        );
    }
}

export function editCategory(id, data) {
    let promise = request.put('/api/v1/category/' + id, data);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSucces('Successfully updated category.'))
            },
            err => {
                dispatch(dispatchFormError(err,'An unknown error occured while creating category.'));
            }
        );
    }
}

export function deleteCategory(id) {
    let promise = request.delete('/api/v1/category/' + id);
    return dispatch => {
        promise.then(
            res => {
                dispatch(dispatchFormSucces('Successfully deleted category.'))
            },
            err => {
                dispatch(dispatchAppError('An unknown error occured while deleting category.'));
            }
        );
    }
}