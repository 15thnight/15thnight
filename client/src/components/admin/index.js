import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';

import AdminWelcome from './AdminWelcome';
import CategoryForm from './CategoryForm';
import ServiceForm from './ServiceForm';
import UserForm from './UserForm';
import AlertHistory from './AlertHistory';
import ManageUsers from './ManageUsers';
import ManageCategories from './ManageCategories';
import ManageServices from './ManageServices';

class AdminDashboard extends React.Component {

    render() {
        let { page, id } = this.props;
        if (page && ['register-user',
                     'alert-history',
                     'manage-users',
                     'edit-user',
                     'manage-categories',
                     'edit-category',
                     'add-category',
                     'manage-services',
                     'edit-service',
                     'add-service'].indexOf(page) < 0) {
            page = undefined;
        }
        return (
            <div>
                <ul className="nav nav-tabs">
                    <li className={ !page && 'active'}>
                        <Link to="/dashboard">Welcome</Link>
                    </li>
                    <li className={ page === 'alert-history' && 'active'}>
                        <Link to="/dashboard/alert-history">Alert History</Link>
                    </li>
                    <li className={ page === 'manage-users' && 'active'}>
                        <Link to="/dashboard/manage-users">Manage Users</Link>
                    </li>
                    <li className={ page === 'manage-categories' && 'active'}>
                        <Link to="/dashboard/manage-categories">Manage Categories</Link>
                    </li>
                    <li className={ page === 'manage-services' && 'active'}>
                        <Link to="/dashboard/manage-services">Manage Services</Link>
                    </li>
                </ul>
                {(() => {
                    switch(page) {
                        case 'register-user': return (<UserForm/>);
                        case 'edit-user':     return (<UserForm id={id}/>);
                        case 'alert-history': return (<AlertHistory />);
                        case 'manage-users':  return (<ManageUsers/>);
                        case 'manage-categories':  return (<ManageCategories/>);
                        case 'edit-category': return (<CategoryForm id={id} />);
                        case 'add-category': return (<CategoryForm />);
                        case 'manage-services':  return (<ManageServices/>);
                        case 'edit-service': return (<ServiceForm id={id} />);
                        case 'add-service': return (<ServiceForm />);
                        default:              return (<AdminWelcome />);
                    }
                })()}
            </div>
        );
    }
}

export default withRouter(AdminDashboard);