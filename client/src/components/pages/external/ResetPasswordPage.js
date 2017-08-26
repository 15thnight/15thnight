import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField, FormErrors } from 'c/form';
import { resetPassword } from 'api';
import { withRequests } from 'react-requests';


@withRouter
@withRequests
@connect(null, { resetPassword })
export default class ResetPasswordPage extends React.Component {
    state = {
        password: '',
        confirm: '',
        error: {}
    }

    componentWillMount() {
        this.props.observeRequest(resetPassword, {
            end: () => this.props.router.push('/'),
            error: error => this.setState({ error })
        });
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
            <Form onSubmit={this.handleSubmit}>
                <h1>Password Reset</h1>
                <p>Enter a new password below:</p>
                <br/>
                <FormErrors errors={this.state.error.form} />
                <InputField
                  type="password"
                  label="New Password"
                  name="password"
                  value={this.state.password}
                  errors={this.state.error.password}
                  onChange={this.handleInputChange}
                />
                <InputField
                  type="password"
                  label="Confirm New Password"
                  name="confirm"
                  value={this.state.confirm}
                  errors={this.state.error.confirm}
                  onChange={this.handleInputChange}
                />
                <div className="text-center">
                    <button className="btn btn-success" type="submit">Submit</button>
                </div>
            </Form>
        )
    }
}
