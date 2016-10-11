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

import {
    createUser, editUser, getUser, deleteUser,
    clearFormStatus
} from 'actions';

class UserForm extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            name: '',
            organization: '',
            email: '',
            password: '',
            confirm: '',
            phone_number: '',
            role: 'advocate',
            services: [],
            editingPassword: false,
            editingUser: {},
            error: {}
        }

        this.state = this.defaultState;
    }

    componentWillMount() {
        if (this.props.params.id) {
            this.props.getUser(this.props.params.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.router.push('/manage-users');
            return this.props.clearFormStatus();
        }
        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError });
            return this.props.clearFormStatus();
        }
        let { id } = this.props.params;
        if (id && nextProps.user[id] &&
                this.props.user[id] !== nextProps.user[id]) {
            let editingUser = nextProps.user[this.props.params.id];
            let { name, organization, email, phone_number, role, services } = editingUser;
            services = services.map(service => service.id);
            this.setState({ name, organization, email, phone_number, role, services, editingUser });
        }
    }

    handleDeletePreviewClick() {
        this.setState({ deleting: true });
    }

    handleDeleteClick() {
        this.props.deleteUser(this.props.params.id);
    }

    handleCategoryChange(services) {
        this.setState({ services });
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        let submitPassword = !this.props.params.id || this.state.editingPassword;
        let { name, organization, email, phone_number, role, services, password, confirm } = this.state;
        let data = { name, organization, email, phone_number, role, services }
        if (submitPassword && password !== confirm) {
            let error = ['Passwords do not match.'];
            return this.setState({
                error: {
                    password: error,
                    confirm: error
                }
            });
        }
        if (submitPassword) {
            data.password = password;
        }
        this.props.params.id ? this.props.editUser(this.props.params.id, data) : this.props.createUser(data);
    }

    handleTogglePassword() {
        this.setState({ editingPassword: !this.state.editingPassword });
    }

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
        let capabilityStyle = {display: this.state.role === 'provider' ? 'block' : 'none'}
        const passwordForm = !this.props.params.id || (this.props.params.id && this.state.editingPassword) ? (
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
        const isEditingPassword = this.props.params.id ? (
            <FormGroup>
                <div
                  className="btn btn-primary"
                  onClick={this.handleTogglePassword.bind(this)}>
                    {this.state.editingPassword ? "Don't Edit Password" : "Edit Password"}
                </div>
            </FormGroup>
        ) : null;
        const roles = [
            ['advocate', 'Advocate'],
            ['provider', 'Provider'],
            ['admin',    'Admin']
        ];
        let deleteButton = null;
        if (this.props.params.id && parseInt(this.props.params.id) !== this.props.current_user.id) {
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
                <h1>{ this.props.params.id ? "Edit User" : "Register User"}</h1>
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
                      values={roles}
                      value={this.state.role}
                      name="role"
                      errors={this.state.error.role}
                      onChange={this.handleInputChange.bind(this)} />
                    <div style={capabilityStyle}>
                        <CategoryField
                          label="Provider Capabilities:"
                          value={this.state.services}
                          onCategoryChange={this.handleCategoryChange.bind(this)} />
                    </div>
                    <button className="btn btn-success" type="submit">
                        { this.props.params.id ? "Submit User" : "Register User" }
                    </button>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        submitFormError: state.submitFormError,
        submitFormSuccess: state.submitFormSuccess,
        current_user: state.current_user,
        user: state.user
    }
}

export default connect(mapStateToProps, {
    createUser,
    editUser,
    clearFormStatus,
    getUser,
    deleteUser
})(withRouter(UserForm));