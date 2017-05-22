/* Routes for admin users */
import {
    AdminAlertHistoryPage,
    CategoryFormPage,
    ManageCategoriesPage,
    ManageServicesPage,
    ManageUsersPage,
    ServiceFormPage,
    UserFormPage
} from 'pages/admin';

import {
    ResolveNeedPage,
    ViewResponsesPage
} from 'pages/advocate';


const childRoutes = [
    { path: '/'                  , component: AdminAlertHistoryPage },
    { path: '/alert-history'     , component: AdminAlertHistoryPage },

    { path: '/manage-users'      , component: ManageUsersPage },
    { path: '/manage-categories' , component: ManageCategoriesPage },
    { path: '/manage-services'   , component: ManageServicesPage },


    { path: '/add-user'          , component: UserFormPage },
    { path: '/add-category'      , component: CategoryFormPage },
    { path: '/add-service'       , component: ServiceFormPage },

    { path: '/edit-user/:id'     , component: UserFormPage },
    { path: '/edit-category/:id' , component: CategoryFormPage },
    { path: '/edit-service/:id'  , component: ServiceFormPage },

    { path: '/resolve-need/:id'   , component: ResolveNeedPage },
    { path: '/view-responses/:id' , component: ViewResponsesPage }
]

export default { childRoutes }
