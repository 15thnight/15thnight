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

// TODO: refactor pages into structure based on API, not roles
import { ViewResponsesPage } from 'pages/advocate';

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

    { path: '/view-responses/:id' , component: ViewResponsesPage}
]

export default { childRoutes }