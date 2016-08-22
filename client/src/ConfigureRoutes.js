import React from 'react';
import { connect } from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';

import Chrome from 'components/chrome';
import {
    AccountRoutes,
    AdminRoutes,
    AdvocateRoutes,
    ExternalRoutes,
    ProviderRoutes
} from 'routes';


const catchAll = { path: '*', onEnter: ({params}, replace) => replace('/') }

export default function configureRoutes(store) {

    function getRoutesForRole(role) {
        switch(role) {
            case 'admin':    return AdminRoutes;
            case 'advocate': return AdvocateRoutes;
            case 'provider': return ProviderRoutes;
        }
    }

    function getUserRoutes(current_user) {
        return [
            AccountRoutes,
            getRoutesForRole(current_user.role),
            catchAll
        ];
    }

    return {
        component: Chrome,
        getChildRoutes(partialNextState, cb) {
            let {current_user} = store.getState();
            store.subscribe(() => {
                if (store.getState().current_user && !current_user)  {
                    current_user = store.getState().current_user;
                    cb(null, getUserRoutes(current_user))
                }
            });
            if (current_user) {
                cb(null, getUserRoutes(current_user))
            } else {
                cb(null, [ExternalRoutes, catchAll])
            }
        }
    }
}