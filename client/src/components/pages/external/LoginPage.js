import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';

import Button from 'c/button';
import { Form, InputField, FormErrors } from 'c/form';
import { loginUser } from 'api';
import { withRequests } from 'react-requests';

import classes from './LoginPage.css';

@withRequests
@withRouter
@connect(({ alertRedirect }) => ({ alertRedirect }), { loginUser })
export default class LoginPage extends React.Component {
    state = {
        email: '',
        password: '',
        error: {}
    }

    componentWillMount() {
        this.props.observeRequest(loginUser, {
            end: () => this.props.router.push('/'),
            error: error => this.setState({ error })
        });
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleSubmit = e => {
        this.setState({ error: {} });
        const { email, password } = this.state;
        const data = { email, password }
        this.props.loginUser({ data });
    }

    render() {
        const inputFieldSizes = { md: [3, 9], sm: [3, 9] };
        return (
            <Form sm centered={false} className={classes.loginPage} onSubmit={this.handleSubmit}>
                <div className="text-center logo">
                    <img src="/static/new_logo.jpeg" alt="15th NIGHT" />
                </div>
                {this.props.alertRedirect && <h2>Please Sign In to Respond to the Alert</h2>}
                {!this.props.alertRedirect && <span className="hidden-xs"><br/><br/><br/></span>}
                <br/>
                <FormErrors errors={this.state.error.form} />
                <InputField
                  label="Email"
                  value={this.state.email}
                  name="email"
                  errors={this.state.error.email}
                  onChange={this.handleInputChange.bind(this)}
                  sizes={inputFieldSizes}
                />
                <InputField
                  type="password"
                  label="Password"
                  value={this.state.password}
                  name="password"
                  errors={this.state.error.password}
                  onChange={this.handleInputChange.bind(this)}
                  sizes={inputFieldSizes}
                >
                    <Link to="/forgot-password">Forgot your password?</Link>
                </InputField>
                <br/>
                <div className="text-center">
                    <Button style="success" lg>Sign In</Button>
                </div>
            </Form>
        );
    }
}
