import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Form, InputField, FormErrors } from 'c/form';
import { changePassword } from 'api';
import { withRequests } from 'react-requests';

@withRouter
@withRequests
@connect(null, { changePassword })
export default class ChangePassowrdPage extends React.Component {
    state = {
        current: '',
        new_password: '',
        confirm: '',
        error: {}
    }

    componentWillMount() {
        this.props.observeRequest(changePassword, {
            end: () => this.props.router.push('/'),
            error: error => this.setState({ error })
        });
    }

    handleInputChange = (name, value) => {
        this.setState({ [name]: value });
    }

    handleSubmit = e => {
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
        const data = { current, new_password };
        this.props.changePassword({ data });
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>Change Password</h1>
                <br/>
                <FormErrors errors={this.state.error.form} />
                <InputField
                  type="password"
                  label="Current Password"
                  name="current"
                  value={this.state.current}
                  errors={this.state.error.current}
                  onChange={this.handleInputChange}
                />
                <InputField
                  type="password"
                  label="New Password"
                  name="new_password"
                  value={this.state.new_password}
                  errors={this.state.error.new_password}
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
                <button className="btn btn-success" type="submit">
                    Submit
                </button>
            </Form>
        )
    }
}
