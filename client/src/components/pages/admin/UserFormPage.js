import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import {
    CategoryField,
    InputField,
    StaticField,
    FormGroup
} from 'form';
import { checkRequest } from 'util';
import {
    createUser,
    editUser,
    getUser,
    deleteUser,
} from 'api';

const ROLE_VALUES = [
    ['advocate', 'Advocate'],
    ['provider', 'Provider'],
    ['admin',    'Admin']
];

class UserForm extends React.Component {
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
        error: {}
    }

    componentWillMount() {
        if (this.props.id) {
            this.props.getUser(this.props.id);
        }
    }

    componentWillReceiveProps({ request, user }) {
        checkRequest(this.props.request, request, [editUser, createUser],
            () => this.props.router.push('/manage-users'),
            error => this.setState({ error })
        );
        if (this.props.user !== user && user) {
            const { name, organization, email, phone_number, role } = user;
            const services = user.services.map(({ id }) => id);
            this.setState({ name, organization, email, phone_number, role, services });
        }
    }

    handleDeletePreviewClick = () => this.setState({ deleting: true });

    handleDeleteClick = () => this.props.deleteUser(this.props.id);

    handleCategoryChange = services => this.setState({ services });

    handleInputChange = (name, value) => this.setState({ [name]: value });

    handleFormSubmit = e => {
        e.preventDefault();
        this.setState({ error: {} });
        const { id } = this.props;
        const submitPassword = !id || this.state.editingPassword;
        const { name, organization, email, phone_number, role, services, password, confirm } = this.state;
        if (submitPassword && password !== confirm) {
            const error = ['Passwords do not match.'];
            return this.setState({
                error: {
                    password: error,
                    confirm: error
                }
            });
        }
        const data = { name, organization, email, phone_number, role, services }
        if (submitPassword) {
            data.password = password;
        }
        id ? this.props.editUser(data, id) : this.props.createUser(data);
    }

    handleTogglePassword = () =>
        this.setState({ editingPassword: !this.state.editingPassword });

    render() {
        if (this.state.deleting) {
            return (
                <div className="text-center row col-md-offset-3 col-md-6">
                    <h1>Delete User</h1>
                    <div>Are you sure you wish to delete this user?</div>
                    <br/>
                    <div className="form-horizontal">
                        <StaticField label="Name">
                          {this.state.editingUser.name}
                        </StaticField>
                        <StaticField label="Organization">
                          {this.state.editingUser.organization}
                        </StaticField>
                        <StaticField label="Email">
                          {this.state.editingUser.email}
                        </StaticField>
                        <StaticField label="Phone Number">
                          {this.state.editingUser.phone_number}
                        </StaticField>
                        <StaticField label="Role">
                          {this.state.editingUser.role}
                        </StaticField>
                        <StaticField label="Created at">
                          {this.state.editingUser.created_at}
                        </StaticField>
                    </div>
                    <div className="text-left">
                        <div className="btn btn-primary" onClick={() => this.setState({deleting: false})}>Cancel</div>
                        <div className="btn btn-danger pull-right" onClick={this.handleDeleteClick.bind(this)}>Delete User</div>
                    </div>
                </div>
            )
        }
        const capabilityStyle = {display: this.state.role === 'provider' ? 'block' : 'none'}
        const { id } = this.props;
        const passwordForm = !id || (id && this.state.editingPassword) ? (
            <div>
                <InputField
                  type="password"
                  label="Password"
                  value={this.state.password}
                  name="password"
                  errors={this.state.error.password}
                  onChange={this.handleInputChange.bind(this)} />
                <InputField
                  type="password"
                  label="Confirm Password"
                  value={this.state.confirm}
                  name="confirm"
                  errors={this.state.error.confirm}
                  onChange={this.handleInputChange.bind(this)} />
            </div>
        ) : null;
        const isEditingPassword = id ? (
            <FormGroup>
                <div
                  className="btn btn-primary"
                  onClick={this.handleTogglePassword.bind(this)}>
                    {this.state.editingPassword ? "Don't Edit Password" : "Edit Password"}
                </div>
            </FormGroup>
        ) : null;
        let deleteButton = null;
        if (id && parseInt(id) !== this.props.current_user.id) {
            deleteButton = (
                <div className="form-group text-right">
                    <div
                      className="btn btn-danger"
                      onClick={this.handleDeletePreviewClick.bind(this)}>
                        Delete User
                    </div>
                </div>
            );
        }
        return (
            <div className="text-center row col-md-offset-3 col-md-6">
                <h1>{ id ? "Edit User" : "Register User"}</h1>
                {deleteButton}
                <form className="form-horizontal" onSubmit={this.handleFormSubmit.bind(this)}>
                    <InputField
                      label="Name"
                      value={this.state.name}
                      name="name"
                      errors={this.state.error.name}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      label="Organization"
                      value={this.state.organization}
                      name="organization"
                      errors={this.state.error.organization}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      label="Email"
                      value={this.state.email}
                      name="email"
                      errors={this.state.error.email}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      label="Phone Number"
                      value={this.state.phone_number}
                      name="phone_number"
                      errors={this.state.error.phone_number}
                      onChange={this.handleInputChange.bind(this)} />
                    {isEditingPassword}
                    {passwordForm}
                    <InputField
                      label="Role"
                      type="select"
                      values={ROLE_VALUES}
                      value={this.state.role}
                      name="role"
                      errors={this.state.error.role}
                      onChange={this.handleInputChange.bind(this)} />
                    <div style={capabilityStyle}>
                        <CategoryField
                          label="Provider Capabilities:"
                          values={this.state.services}
                          onCategoryChange={this.handleCategoryChange.bind(this)} />
                    </div>
                    <button className="btn btn-success" type="submit">
                        { id ? "Submit User" : "Register User" }
                    </button>
                </form>
            </div>
        )
    }
}


const mapStateToProps = ({ request, current_user, user }, { params: { id } }) =>
    ({ request, current_user, id, user: user[id] });

export default connect(mapStateToProps, {
    createUser,
    editUser,
    getUser,
    deleteUser
})(withRouter(UserForm));
