import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';

import { loginUser } from 'actions';
import { InputField, FormErrors } from 'form';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError })
        }
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        let { email, password } = this.state;
        this.props.loginUser({ email, password });
    }

    render() {
        return (
            <div className="col-md-6 col-md-offset-3 text-center">
                <h1>Please Sign In{ this.props.alertRedirect && " to Respond to the Alert"}</h1>
                <br/>
                <FormErrors errors={this.state.error.form} />
                <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    <InputField
                      label="Email"
                      value={this.state.email}
                      name="email"
                      errors={this.state.error.email}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      type="password"
                      label="Password"
                      value={this.state.password}
                      name="password"
                      errors={this.state.error.password}
                      onChange={this.handleInputChange.bind(this)}>
                        <Link to="/forgot-password">Forgot your password?</Link>
                    </InputField>
                    <br/>
                    <div className="text-center">
                        <button className="btn btn-success" type="submit">Sign In</button>
                    </div>
                    <div className="text-center">
                        <img src="/static/new_logo.jpeg" alt="15th NIGHT" />
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        current_user: state.current_user,
        submitFormError: state.submitFormError,
        alertRedirect: state.alertRedirect
    }
}

export default connect(mapStateToProps, {
    loginUser
})(withRouter(LoginPage));