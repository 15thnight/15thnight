import React from 'react';
import { Provider } from 'react-redux';
import { render }from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import 'lib/bootstrap3/dist/css/bootstrap.min.css';

import Chrome from 'components/chrome';
import LoginPage from 'pages/LoginPage';
import LogoutPage from 'pages/LogoutPage';
import AboutPage from 'pages/AboutPage';
import RespondToPage from 'pages/RespondToPage';
import DashboardPage from 'pages/DashboardPage';
import ChangePasswordPage from 'pages/ChangePasswordPage';
import EditProfilePage from 'pages/EditProfilePage';
import ForgotPasswordPage from 'pages/ForgotPasswordPage';
import ResetPasswordPage from 'pages/ResetPasswordPage';
import configureStore from 'store/Store';

import 'style/bootstrap.theme'

const store = configureStore();

render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route component={Chrome}>
                <Route path="/" component={DashboardPage} />
                <Route path="/dashboard" component={DashboardPage} />
                <Route path="/dashboard/:page" component={DashboardPage} />
                <Route path="/dashboard/:page/:id" component={DashboardPage} />
                <Route path="/about" component={AboutPage} />

                <Route path="/respond_to/:id" component={RespondToPage} />

                // User Routes
                <Route path="/login" component={LoginPage} />
                <Route path="/logout" component={LogoutPage} />
                <Route path="/edit-profile" component={EditProfilePage} />
                <Route path="/change-password" component={ChangePasswordPage} />
                <Route path="/forgot-password" component={ForgotPasswordPage} />
                <Route path="/reset-password/:email/:token" component={ResetPasswordPage} />
            </Route>
        </Router>
    </Provider>
, document.getElementById('entry'));