import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { createUser, editUser, getUser, deleteUser } from 'api';
import { withRequests } from 'react-requests';
import Button from 'c/button';
import {
    CategoryField,
    DeleteConfirmForm,
    Form,
    InputField,
    StaticField,
    FormGroup
} from 'c/form';
import Timestamp from 'c/timestamp';


const ROLE_OPTIONS = [
    { value: 'advocate', label: 'Advocate' },
    { value: 'provider', label: 'Provider' },
    { value: 'admin',    label: 'Admin' }
];

@withRouter
@withRequests
@connect(
    ({ current_user, user }, { params: { id } }) => ({ current_user, id, user: user[id] }),
    { createUser, editUser, getUser, deleteUser }
)
export default class UserForm extends React.Component {
    state = {
        name: '',
        organization: '',
        email: '',
        password: '',
        confirm: '',
        phone_number: '',
        role: 'advocate',
        services: [],
        editingPassword: false,
        deleting: false,
        error: {}
    }

    componentWillMount() {
        const { id } = this.props;
        id && this.props.getUser({ id });
        this.props.observeRequest([editUser, createUser, deleteUser], {
            end: () => this.props.router.push('/manage-users'),
            error: error => this.setState({ error })
        });
    }

    componentWillReceiveProps({ request, user }) {
        if (this.props.user !== user && user) {
            const { name, organization, email, phone_number, role } = user;
            const services = user.services.map(({ id }) => id);
            this.setState({ name, organization, email, phone_number, role, services });
        }
    }

    handleCategoryChange = services => this.setState({ services });

    handleInputChange = (name, value) => this.setState({ [name]: value });

    handleSubmit = e => {
        this.setState({ error: {} });
        const { id } = this.props;
        const submitPassword = !id || this.state.editingPassword;
        const { name, organization, email, phone_number, role, services, password, confirm } = this.state;
        if (submitPassword && password !== confirm) {
            const error = ['passwords do not match.'];
            return this.setState({
                error: {
                    password: error,
                    confirm: error
                }
            });
        }
        console.log(services)
        const data = { name, organization, email, phone_number, role, services }
        if (submitPassword) {
            data.password = password;
        }
        id ? this.props.editUser({ data, id }) : this.props.createUser({ data });
    }

    handleTogglePassword = () =>
        this.setState({ editingPassword: !this.state.editingPassword });

    renderDeleteConfirm = ({ id, name, organization, email, phone_number, role, created_at }) => (
        <DeleteConfirmForm
          title='User'
          onCancel={e => this.setState({ deleting: false })}
          onConfirm={e => this.props.deleteUser({ id })}
        >
            <StaticField label="Name">{name}</StaticField>
            <StaticField label="Organization">{organization}</StaticField>
            <StaticField label="Email">{email}</StaticField>
            <StaticField label="Phone Number">{phone_number}</StaticField>
            <StaticField label="Role">{role}</StaticField>
            <StaticField label="Created at"><Timestamp time={created_at} /></StaticField>
        </DeleteConfirmForm>
    )

    render() {
        if (this.state.deleting) {
            return this.renderDeleteConfirm(this.props.user);
        }
        const { role, editingPassword } = this.state;
        const { id, current_user } = this.props;
        const capabilityStyle = { display: role === 'provider' ? 'block' : 'none' }
        const passwordForm = (!id || (id && editingPassword)) && (
            <div>
                <InputField
                  type="password"
                  label="Password"
                  value={this.state.password}
                  name="password"
                  errors={this.state.error.password}
                  onChange={this.handleInputChange}
                />
                <InputField
                  type="password"
                  label="Confirm Password"
                  value={this.state.confirm}
                  name="confirm"
                  errors={this.state.error.confirm}
                  onChange={this.handleInputChange}
                />
            </div>
        );
        const toggleEditPasswordButton = id && (
            <FormGroup noColon>
                <Button onClick={this.handleTogglePassword} type="button">
                    {editingPassword ? "Don't Edit Password" : "Edit Password"}
                </Button>
            </FormGroup>
        );
        const deleteButton = id && parseInt(id) !== current_user.id && (
            <div className="form-group text-right">
                <Button style="danger" type="button" onClick={() => this.setState({ deleting: true })}>
                    Delete User
                </Button>
            </div>
        );
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>{id ? "Edit User" : "Register User"}</h1>
                {deleteButton}
                <InputField
                  label="Name"
                  value={this.state.name}
                  name="name"
                  errors={this.state.error.name}
                  onChange={this.handleInputChange}
                />
                <InputField
                  label="Organization"
                  value={this.state.organization}
                  name="organization"
                  errors={this.state.error.organization}
                  onChange={this.handleInputChange}
                />
                <InputField
                  label="Email"
                  value={this.state.email}
                  name="email"
                  errors={this.state.error.email}
                  onChange={this.handleInputChange}
                />
                <InputField
                  type="phone"
                  label="Phone Number"
                  value={this.state.phone_number}
                  name="phone_number"
                  errors={this.state.error.phone_number}
                  onChange={this.handleInputChange}
                />
                {toggleEditPasswordButton}
                {passwordForm}
                <InputField
                  label="Role"
                  type="select"
                  options={ROLE_OPTIONS}
                  value={this.state.role}
                  name="role"
                  errors={this.state.error.role}
                  onChange={this.handleInputChange}
                />
                <div style={capabilityStyle}>
                    <CategoryField
                      label="Provider Capabilities"
                      values={this.state.services}
                      onCategoryChange={this.handleCategoryChange}
                    />
                </div>
                <Button lg style="success">{id ? "Submit User" : "Register User"}</Button>
            </Form>
        )
    }
}
