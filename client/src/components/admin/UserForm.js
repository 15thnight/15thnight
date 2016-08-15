import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import CategoryField from 'form/CategoryField';
import InputField from 'form/InputField';
import StaticField from 'form/StaticField';
import FormGroup from 'form/FormGroup';
import {
    createUser, editUser, getUser, deleteUser,
    clearFormStatus
} from 'actions';

class UserForm extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            email: '',
            password: '',
            confirm: '',
            phone_number: '',
            role: 'advocate',
            categories: [],
            editingPassword: false,
            editingUser: {},
            error: {}
        }

        this.state = this.defaultState;
    }

    componentWillMount() {
        if (this.props.id) {
            this.props.getUser(this.props.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.router.push('/dashboard/manage-users');
            return this.props.clearFormStatus();
        }
        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError });
            return this.props.clearFormStatus();
        }
        if (this.props.id && nextProps.user[this.props.id]) {
            let user = nextProps.user[this.props.id];
            this.setState({
                email: user.email,
                phone_number: user.phone_number,
                role: user.role,
                categories: user.capabilities.map(capability =>{ return capability.id}),
                editingPassword: false,
                editingUser: user
            });
        }
    }

    handleDeletePreviewClick() {
        this.setState({ deleting: true });
    }

    handleDeleteClick() {
        this.props.deleteUser(this.props.id);
    }

    handleCategoryChange(categories) {
        this.setState({ categories });
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        let data = {
            email: this.state.email,
            phone_number: this.state.phone_number,
            role: this.state.role,
            categories: this.state.categories
        }
        if (!this.props.id || this.state.editingPassword) {
            data.password = this.state.password;
            data.confirm = this.state.confirm;
        }
        this.props.id ? this.props.editUser(this.props.id, data) : this.props.createUser(data);
    }

    handleTogglePassword() {
        this.setState({ editingPassword: !this.state.editingPassword });
    }

    render() {
        if (this.state.deleting) {
            return (
                <div className="text-center row col-sm-offset-3 col-sm-6">
                    <h1>Delete User</h1>
                    <div>Are you sure you wish to delete this user?</div>
                    <br/>
                    <div className="form-horizontal">
                        <StaticField label="Email">
                          {this.state.editingUser.email}
                        </StaticField>
                        <StaticField label="Phone Number">
                          this.state.editingUser.phone_number}
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
        const passwordForm = !this.props.id || (this.props.id && this.state.editingPassword) ? (
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
        const isEditingPassword = this.props.id ? (
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
        if (this.props.id && parseInt(this.props.id) !== this.props.current_user.id) {
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
            <div className="text-center row col-sm-offset-3 col-sm-6">
                <h1>{ this.props.id ? "Edit User" : "Register User"}</h1>
                {deleteButton}
                <form className="form-horizontal" onSubmit={this.handleFormSubmit.bind(this)}>
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
                          value={this.state.categories}
                          onCategoryChange={this.handleCategoryChange.bind(this)} />
                    </div>
                    <button className="btn btn-success" type="submit">
                        { this.props.id ? "Submit User" : "Register User" }
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
        current_user: state.current_user
    }
}

export default connect(mapStateToProps, {
    createUser,
    editUser,
    clearFormStatus,
    getUser,
    deleteUser
})(withRouter(UserForm));