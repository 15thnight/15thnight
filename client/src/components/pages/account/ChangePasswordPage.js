import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField, FormErrors } from 'form';
import { changePassword, clearFormStatus } from 'actions';

const { stringify, parse } = JSON;

class ChangePassowrdPage extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            current: '',
            new_password: '',
            confirm: '',
            error: {}
        }
        this.state = parse(stringify(this.defaultState));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.setState(this.defaultState);
            return this.props.clearFormStatus();
        }
        if (nextProps.submitFormError) {
            this.setState({
                error: nextProps.submitFormError
            });
            return this.clearFormStatus();
        }
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({ errors: {} });
        let { current, new_password, confirm } = this.state;
        if (new_password !== confirm) {
            let error = ['Passwords do not match.'];
            return this.setState({
                error: {
                    new_password: error,
                    confirm: error
                }
            });
        }
        this.props.changePassword({ current, new_password });
    }

    render() {
        return (
            <div className="text-center row col-sm-offset-3 col-sm-6">
                <h1>Change Password</h1>
                <br/>
                <FormErrors errors={this.state.error.form} />
                <form className="form-horizontal" onSubmit={this.handleFormSubmit.bind(this)}>
                    <InputField
                      type="password"
                      label="Current Password"
                      name="current"
                      value={this.state.current}
                      errors={this.state.error.current}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      type="password"
                      label="New Password"
                      name="new_password"
                      value={this.state.new_password}
                      errors={this.state.error.new_password}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      type="password"
                      label="Confirm New Password"
                      name="confirm"
                      value={this.state.confirm}
                      errors={this.state.error.confirm}
                      onChange={this.handleInputChange.bind(this)} />
                    <button className="btn btn-success" type="submit">
                        Submit
                    </button>
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
    changePassword
})(withRouter(ChangePassowrdPage));