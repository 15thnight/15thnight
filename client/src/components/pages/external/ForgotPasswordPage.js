import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField } from 'form';
import { forgotPassword, clearFormStatus } from 'actions';


class ForgotPasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            error: {}
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.router.push('/login');
            return this.props.clearFormStatus();
        }
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        this.props.forgotPassword({ email: this.state.email });
    }


    render() {

        return (
              <div className="col-md-6 col-md-offset-3 text-center">
                <h1>Forgotten Password</h1>
                <p>Enter your email below and click submit to receive password reset instructions</p>
                <br/>
                <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    <InputField
                      label="Email"
                      value={this.state.email}
                      name="email"
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
    forgotPassword,
    clearFormStatus
})(withRouter(ForgotPasswordPage));