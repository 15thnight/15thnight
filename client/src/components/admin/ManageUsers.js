import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getUsers } from 'actions';

class ManageUsers extends React.Component {

    componentWillMount() {
        this.props.getUsers();
    }

    render() {
        let { users, current_user } = this.props;
        return (
            <div className="tab-pane" id="manage-users">
                <h1 className="text-center">Manage Users</h1>
                <div className="text-right">
                    <Link to="/dashboard/register-user" className="btn btn-success">Register User</Link>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Created At</th>
                            <th>Role</th>
                            <th>Provider Capabilities</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        { users.map((user, key) => {
                            let services = user.role === 'provider' ?
                                user.services.map(service => { return service.name}).join(', ') :
                                'N/A';
                            if (user.role === 'provider' && user.services.length == 0) {
                                services = 'None Selected';
                            }
                            return (
                                <tr key={key}>
                                    <td>{ user.email }</td>
                                    <td>{ user.phone_number }</td>
                                    <td>{ user.created_at }</td>
                                    <td>{ user.role }</td>
                                    <td>{ services }</td>
                                    <td><Link to={"/dashboard/edit-user/" + user.id} className="btn btn-primary">Edit</Link></td>
                                </tr>
                            )
                        }) }
                </tbody>
            </table>
        </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        current_user: state.current_user,
        users: state.users
    }
}

export default connect(mapStateToProps,{
    getUsers
})(ManageUsers);