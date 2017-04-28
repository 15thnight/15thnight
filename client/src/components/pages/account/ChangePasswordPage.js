import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField, FormErrors } from 'form';
import { changePassword } from 'api';
import { checkRequest } from 'util';

const DEFAULT_STATE = {
    current: '',
    new_password: '',
    confirm: '',
    error: {}
}

class ChangePassowrdPage extends React.Component {

    state = Object.assign({}, DEFAULT_STATE);

    componentWillReceiveProps({ request }) {
        checkRequest(this.props.request, request, changePassword,
            () => this.props.router.push('/'),
            error => this.setState({ error })
        );
    }

    handleInputChange = (name, value) => {
        this.setState({ [name]: value });
    }

    handleFormSubmit = e => {
        e.preventDefault();
        this.setState({ errors: {} });
        const { current, new_password, confirm } = this.state;
        if (new_password !== confirm) {
            const error = ['Passwords do not match.'];
            return this.setState({
                error: {
                    new_password: error,
                    confirm: error
                }
            });
        }
        this.props.changePassword({ current, new_password });
    }

    render() {
        return (
            <div className="text-center row col-md-offset-3 col-md-6">
                <h1>Change Password</h1>
                <br/>
                <FormErrors errors={this.state.error.form} />
                <form className="form-horizontal" onSubmit={this.handleFormSubmit}>
                    <InputField
                      type="password"
                      label="Current Password"
                      name="current"
                      value={this.state.current}
                      errors={this.state.error.current}
                      onChange={this.handleInputChange} />
                    <InputField
                      type="password"
                      label="New Password"
                      name="new_password"
                      value={this.state.new_password}
                      errors={this.state.error.new_password}
                      onChange={this.handleInputChange} />
                    <InputField
                      type="password"
                      label="Confirm New Password"
                      name="confirm"
                      value={this.state.confirm}
                      errors={this.state.error.confirm}
                      onChange={this.handleInputChange} />
                    <button className="btn btn-success" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ request }) => ({ request });

export default connect(mapStateToProps, {
    changePassword
})(withRouter(ChangePassowrdPage));
