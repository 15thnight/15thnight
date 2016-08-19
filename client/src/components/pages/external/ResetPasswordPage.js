import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField, FormErrors } from 'form';
import { resetPassword, clearFormStatus } from 'actions';


class ResetPasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirm: '',
            error: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.router.push('/');
            return this.props.clearFormStatus();
        }
        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError });
            return this.props.clearFormStatus();
        }
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        let { email, token } = this.props.params;
        let { password, confirm } = this.state;
        if (password !== confirm) {
            let error = 'Passwords do not match.';
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
                <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    <FormErrors errors={this.state.error.form} />
                    <InputField
                      type="password"
                      label="New Password"
                      name="password"
                      value={this.state.password}
                      errors={this.state.error.password}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      type="password"
                      label="Confirm New Password"
                      name="confirm"
                      value={this.state.confirm}
                      errors={this.state.error.confirm}
                      onChange={this.handleInputChange.bind(this)} />
                    <div className="text-center">
                        <button className="btn btn-success" type="submit">Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        submitFormSuccess: state.submitFormSuccess,
        submitFormError: state.submitFormError
    }
}

export default connect(mapStateToProps, {
    resetPassword,
    clearFormStatus
})(withRouter(ResetPasswordPage));