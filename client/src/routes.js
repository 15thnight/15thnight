import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, browserHistory } from 'react-router';

import Chrome from 'c/chrome';
import {
    AdminAlertHistoryPage,
    CategoryFormPage,
    ManageCategoriesPage,
    ManageServicesPage,
    ManageUsersPage,
    ServiceFormPage,
    UserFormPage
} from 'c/pages/admin';
import {
    AdvocateAlertHistoryPage,
    AdvocateHelpPage,
    AlertFormPage,
    ResolveNeedPage,
    ViewResponsesPage
} from 'c/pages/advocate';
import {
    ProviderActiveAlertsPage,
    ProviderAllAlertsPage,
    ProviderHelpPage,
    ProviderRespondedAlertsPage,
    RespondToPage
} from 'c/pages/provider';
import { EditProfilePage, ChangePasswordPage } from 'c/pages/account';
import {
    LoginPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    RespondToRedirect
} from 'c/pages/external'


const makeCatchAll = redirect =>
    ({ path: '*', onEnter: (p, replace) => replace(redirect) });

const routes = {};

const accountRoutes = [
    { path: '/edit-profile'   , component: EditProfilePage },
    { path: '/change-password', component: ChangePasswordPage }
]

const viewAlertRoutes = [
    { path: '/view/:id'                  , component: ViewResponsesPage },
    { path: '/view/:alert_id/resolve/:id', component: ResolveNeedPage },
]

routes.admin = [
    ...accountRoutes,
    ...viewAlertRoutes,
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
    { path: '/view/:id'          , component: ViewResponsesPage},
    makeCatchAll('/alert-history')
]

routes.advocate = [
    ...accountRoutes,
    ...viewAlertRoutes,
    { path: '/send-alert'                , component: AlertFormPage },
    { path: '/alert-history'             , component: AdvocateAlertHistoryPage },
    { path: '/help'                      , component: AdvocateHelpPage },
    makeCatchAll('/send-alert')
]

routes.provider = [
    ...accountRoutes,
    { path: '/active-alerts'     , component: ProviderActiveAlertsPage },
    { path: '/all-alerts'        , component: ProviderAllAlertsPage },
    { path: '/responded-alerts'  , component: ProviderRespondedAlertsPage },
    { path: '/r/:id'             , component: RespondToPage },
    { path: '/respond-to/:id'    , component: RespondToPage },
    { path: '/help'              , component: ProviderHelpPage },
    makeCatchAll('/active-alerts')
]

routes.anonymous = [
    { path: '/login'                        , component: LoginPage },
    { path: '/forgot-password'              , component: ForgotPasswordPage },
    { path: '/reset-password/:email/:token' , component: ResetPasswordPage },
    { path: '/r/:alertId'                   , component: RespondToRedirect },
    { path: '/respond-to/:alertId'          , component: RespondToRedirect },
    makeCatchAll('/login')
]

export default store => ({
    component: Chrome,
    getChildRoutes(partialNextState, cb) {
        const { current_user } = store.getState();
        cb(null, routes[current_user ? current_user.role : 'anonymous']);
        if (!current_user) {
            const unsubscribe = store.subscribe(() => {
                const { current_user } = store.getState();
                if (current_user)  {
                    unsubscribe();
                    cb(null, routes[current_user.role]);
                }
            });
        }
    }
});
