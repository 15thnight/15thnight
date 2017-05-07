import React from 'react';
import { connect } from 'react-redux';

import { getUsers } from 'api';
import Button from 'c/button';
import { ManageHeader } from 'c/manage';
import Table from 'c/table';
import Timestamp from 'c/timestamp';
import { ContactInfo } from 'c/user';


@connect(({ current_user, users }) => ({ current_user, users }), { getUsers })
export default class ManageUsers extends React.Component {
    componentWillMount() {
        this.props.getUsers();
    }

    getServices = (role, services) =>
        role !== 'provider'
            ? 'N/A'
            : (services.map(({ name }) => name).join(', ') || 'None Selected');

    render() {
        const { users, current_user } = this.props;
        return (
            <div>
                <ManageHeader title="Users" entity="User" addRoute="/add-user" />
                <Table>
                    <Table.Header>
                        <th>Name</th>
                        <th>Organization</th>
                        <th>Contact</th>
                        <th>Created At</th>
                        <th>Role</th>
                        <th>Provider Capabilities</th>
                        <th>Edit</th>
                    </Table.Header>
                    {users.map(({ role, services, name, organization, email, phone_number, created_at, id }) => (
                        <Table.Row key={id}>
                            <td>{name}</td>
                            <td>{organization}</td>
                            <td><ContactInfo email={email} phone_number={phone_number} /></td>
                            <td><Timestamp time={created_at} multiLine /></td>
                            <td>{role.charAt(0).toUpperCase() + role.slice(1)}</td>
                            <td>{this.getServices(role, services)}</td>
                            <td><Button to={`/edit-user/${id}`}>Edit</Button></td>
                        </Table.Row>
                    ))}
                </Table>
        </div>
        )
    }
}
