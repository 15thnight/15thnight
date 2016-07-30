import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { loginUser } from 'actions';
import InputField from 'form/InputField';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    checkForUserAndRedirect(props) {
        if (props.current_user) {
            this.props.router.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.current_user) {
            this.props.router.push('/')
        }
    }

    componentWillMount() {
        if (this.props.current_user) {
            this.props.router.push('/');
        }
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        let data = {
            email: this.state.email,
            password: this.state.password
        }
        this.props.loginUser(data);
    }

    render() {
        return (
            <div className="col-md-6 col-md-offset-3">
                <h1 className="text-center">Please Sign In</h1>
                <br/>
                <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    <InputField
                      label="Email"
                      value={this.state.email}
                      name="email"
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      type="password"
                      label="Password"
                      value={this.state.password}
                      name="password"
                      onChange={this.handleInputChange.bind(this)} />
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
        current_user: state.current_user
    }
}

export default connect(mapStateToProps, {
    loginUser
})(withRouter(LoginPage));