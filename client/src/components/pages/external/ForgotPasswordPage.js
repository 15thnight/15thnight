import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Form, InputField } from 'c/form';
import { forgotPassword } from 'api';
import { withRequests } from 'react-requests';


@withRouter
@withRequests
@connect(null, { forgotPassword })
export default class ForgotPasswordPage extends React.Component {
    state = {
        email: '',
        error: {}
    }

    componentWillMount() {
        this.props.observeRequest(forgotPassword, {
            end: () => this.props.router.push('/login'),
            error: error => this.setState({ error })
        });
    }

    handleInputChange = (name, value) => this.setState({ [name]: value });


    handleSubmit = e => {
        this.setState({ error: {} });
        const { email } = this.state;
        const data = { email };
        this.props.forgotPassword({ data });
    }


    render = () => (
        <Form onSubmit={this.handleSubmit}>
            <h1>Forgotten Password</h1>
            <p>Enter your email below and click submit to receive password reset instructions</p>
            <br/>
            <InputField
              label="Email"
              value={this.state.email}
              name="email"
              onChange={this.handleInputChange}
            />
            <div className="text-center">
                <button className="btn btn-success" type="submit">Submit</button>
            </div>
        </Form>
    )
}
