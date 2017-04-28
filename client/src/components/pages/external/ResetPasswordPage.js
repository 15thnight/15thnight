import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField, FormErrors } from 'form';
import { resetPassword } from 'api';
import { checkRequest } from 'util';


class ResetPasswordPage extends React.Component {
    state = {
        password: '',
        confirm: '',
        error: {}
    }

    componentWillReceiveProps({ request }) {
        checkRequest(this.props.request, request, resetPassword,
            () => this.props.router.push('/'),
            error => this.setState({ error })
        );
    }

    handleInputChange = (name, value) => {
        this.setState({ [name]: value });
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({ error: {} });
        const { email, token } = this.props.params;
        const { password, confirm } = this.state;
        if (password !== confirm) {
            const error = 'Passwords do not match.';
            return this.setState({
                error: {
                    password: [error],
                    confirm: [error]
                }
            });
        }
        this.props.resetPassword({ email, token, password });
    }

    render() {
        return (
              <div className="col-md-6 col-md-offset-3 text-center">
                <h1>Password Reset</h1>
                <p>Enter a new password below:</p>
                <br/>
                <form className="form-horizontal" onSubmit={this.handleSubmit}>
                    <FormErrors errors={this.state.error.form} />
                    <InputField
                      type="password"
                      label="New Password"
                      name="password"
                      value={this.state.password}
                      errors={this.state.error.password}
                      onChange={this.handleInputChange} />
                    <InputField
                      type="password"
                      label="Confirm New Password"
                      name="confirm"
                      value={this.state.confirm}
                      errors={this.state.error.confirm}
                      onChange={this.handleInputChange} />
                    <div className="text-center">
                        <button className="btn btn-success" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ request }) => ({ request });

export default connect(mapStateToProps, {
    resetPassword
})(withRouter(ResetPasswordPage));
