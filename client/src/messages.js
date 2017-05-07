import {
    updateProfile,
    changePassword,
    sendHelpMessage,
    forgotPassword,

    /* Alert API */
    getAlerts,
    getAlert,
    sendAlert,

    /* Category API */
    getCategories,
    getCategory,
    setCategorySort,
    createCategory,
    editCategory,
    deleteCategory,

    /* Need API */
    getNeed,
    resolveNeed,
    resolveAllNeeds,

    /* Response API */
    sendResponse,

    /* Service (administration) API */
    getServices,
    getService,
    createService,
    editService,
    deleteService,

    /* User (administration) API */
    getUsers,
    getUser,
    createUser,
    editUser,
    deleteUser
} from 'api';


export default {
    /* Account API */
    [updateProfile]: {
        success: 'Updated Profile',
        error: 'Update Profile'
    },
    [changePassword]: {
        success: 'Changed Password',
        error: 'Change Password'
    },
    [sendHelpMessage]: {
        success: 'Sent Help Message',
        error: 'Send Help Message'
    },
    [forgotPassword]: {
        success: 'Sent Password Reset Email',
        error: 'Send Password Reset Email'
    },

    /* Alert API */
    [getAlerts]: {
        isForm: false,
        error: 'Load Alerts'
    },
    [getAlert]: {
        isForm: false,
        error: 'Load Alert',
    },
    [sendAlert]: {
        success: 'Sent Alert',
        error: 'Send Alert'
    },

    /* Category API */
    [getCategories]: {
        isForm: false,
        error: 'Load Categories'
    },
    [getCategory]: {
        isForm: false,
        error: 'Load Category'
    },
    [setCategorySort]: {
        isForm: false,
        error: 'Set Category Sorting Position'
    },
    [createCategory]: {
        success: 'Created Category',
        error: 'Create Category'
    },
    [editCategory]: {
        success: 'Edited Category',
        error: 'Edit Category'
    },
    [deleteCategory]: {
        success: 'Deleted Category',
        error: 'Delete Category'
    },

    /* Need API */
    [getNeed]: {
        isForm: false,
        error: 'Load Need'
    },
    [resolveNeed]: {
        success: 'Resolved Need',
        error: 'Resolve Need'
    },
    [resolveAllNeeds]: {
        isForm: false,
        error: 'Resolve All Needs'
    },

    /* Response API */
    [sendResponse]: {
        success: 'Sent Response',
        error: 'Send Response'
    },

    /* Service (administration) API */
    [getServices]: {
        isForm: false,
        error: 'Load Services'
    },
    [getService]: {
        isForm: false,
        error: 'Load Service'
    },
    [createService]: {
        success: 'Created Service',
        error: 'Create Service'
    },
    [editService]: {
        success: 'Edited Serivce',
        error: 'Edit Service'
    },
    [deleteService]: {
        success: 'Deleted Serivice',
        error: 'Delete Service'
    },

    /* User (administration) API */
    [getUsers]: {
        isForm: false,
        error: 'Load Users'
    },
    [getUser]: {
        isForm: false,
        error: 'Load User'
    },
    [createUser]: {
        success: 'Created User',
        error: 'Create User'
    },
    [editUser]: {
        success: 'Edited User',
        error: 'Edit User'
    },
    [deleteUser]: {
        success: 'Deleted User',
        error: 'Delete User'
    },
}
