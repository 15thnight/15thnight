import { createApi } from 'react-requests';

const api = createApi('/api/v1');

/* Account API */
export const loginUser = api.post('/account/login');
export const getCurrentUser = api.get('/account/current_user');
export const changePassword = api.post('/account/change-password');
export const updateProfile = api.post('/account/update-profile');
export const forgotPassword = api.post('/account/forgot-password');
export const resetPassword = api.post('/account/reset-password');
export const sendHelpMessage = api.post('/account/help');

/* Alert API */
export const getAlerts = api.get(({ scope='' }) => `/alert?scope=${scope}`);
export const getAlert = api.get(({ id }) => `/alert/${id}`);
export const sendAlert = api.post('/alert');

/* Category API */
export const getCategories = api.get('/category');
export const getCategory = api.get(({ id }) => `/category/${id}`);
export const setCategorySort = api.put('/category/sort_order');
export const createCategory = api.post('/category');
export const editCategory = api.put(({ id }) => `/category/${id}`);
export const deleteCategory = api.delete(({ id }) => `/category/${id}`);

/* Need API */
export const getNeed = api.get(({ id }) => `/need/${id}`);
export const resolveNeed = api.post(({ id }) => `/need/${id}/resolve`);
export const resolveAllNeeds = api.post(({ id }) => `/api/v1/alert/${id}/resolve-all-needs`);

/* Response API */
export const sendResponse = api.post('/response');

/* Service (administration) API */
export const getServices = api.get('/service');
export const getService = api.get(({ id }) => `/service/${id}`);
export const createService = api.post('/service');
export const editService = api.put(({ id }) => `/service/${id}`);
export const deleteService = api.delete(({ id }) => `/service/${id}`);

/* User (administration) API */
export const getUsers = api.get('/user');
export const getUser = api.get(({ id }) => `/user/${id}`);
export const createUser = api.post('/user');
export const editUser = api.put(({ id }) => `/user/${id}`);
export const deleteUser = api.delete(({ id }) => `/user/${id}`);
