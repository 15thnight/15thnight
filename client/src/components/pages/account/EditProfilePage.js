import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField, CategoryField } from 'form';
import { updateProfile, clearFormStatus } from 'actions';

const { stringify, parse } = JSON;

class EditProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            email: '',
            phone_number: '',
            services: [],
            error: {}
        }
        this.state = parse(stringify(this.defaultState));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError });
            return this.props.clearFormStatus();
        }
    }

    componentWillMount() {
        let { name, organization, email, phone_number, services } = this.props.user;
        services = services.map(service => service.id);
        this.setState({ name, organization, email, phone_number, services });
    }

    handleCategoryChange(services) {
        this.setState({ services: services });
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        let { name, organization, email, phone_number, services } = this.state;
        this.props.updateProfile({ name, organization, email, phone_number, services });
    }

    render() {
        let { user } = this.props;
        return (
            <div className="text-center row col-sm-offset-3 col-sm-6">
                <h1>Edit Profile</h1>
                <br/>
                <form className="form-horizontal" onSubmit={this.handleFormSubmit.bind(this)}>
                    <InputField
                      label="Name"
                      name="name"
                      value={this.state.name}
                      errors={this.state.error.name}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      label="Organization"
                      name="organization"
                      value={this.state.organization}
                      errors={this.state.error.organization}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      label="Email"
                      name="email"
                      value={this.state.email}
                      errors={this.state.error.email}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      label="Phone Number"
                      name="phone_number"
                      value={this.state.phone_number}
                      errors={this.state.error.phone_number}
                      onChange={this.handleInputChange.bind(this)} />
                    {
                        user.role === 'provider' &&
                        <CategoryField
                          label="Capabilities:"
                          value={this.state.services}
                          onCategoryChange={this.handleCategoryChange.bind(this)} />
                    }
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
        user: state.current_user,
        submitFormError: state.submitFormError
    }
}

export default connect(mapStateToProps, {
    updateProfile, clearFormStatus
})(withRouter(EditProfilePage));