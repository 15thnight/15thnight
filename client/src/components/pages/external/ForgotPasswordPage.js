import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField } from 'form';
import { forgotPassword } from 'api';
import { checkRequest } from 'util';


class ForgotPasswordPage extends React.Component {
    state = {
        email: '',
        error: {}
    }

    componentWillReceiveProps({ request }) {
        checkRequest(this.props.request, request, forgotPassword,
            () => this.props.router.push('/login'),
            error => this.setState({ error })
        );
    }

    handleInputChange = (name, value) => this.setState({ [name]: value });


    handleSubmit = e => {
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
                <form className="form-horizontal" onSubmit={this.handleSubmit}>
                    <InputField
                      label="Email"
                      value={this.state.email}
                      name="email"
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
    forgotPassword
})(withRouter(ForgotPasswordPage));
