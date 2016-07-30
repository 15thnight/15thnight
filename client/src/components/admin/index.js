import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';

import AdminWelcome from './AdminWelcome';
import CategoryForm from './CategoryForm';
import UserForm from './UserForm';
import AlertHistory from './AlertHistory';
import ManageUsers from './ManageUsers';
import ManageCategories from './ManageCategories';

class AdminDashboard extends React.Component {

    render() {
        let { page, id } = this.props;
        if (page && ['register-user',
                     'alert-history',
                     'manage-users',
                     'edit-user',
                     'manage-categories',
                     'edit-category',
                     'add-category'].indexOf(page) < 0){
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
                        default:              return (<AdminWelcome />);
                    }
                })()}
            </div>
        );
    }
}

export default withRouter(AdminDashboard);