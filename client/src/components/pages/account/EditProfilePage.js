import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField, CategoryField } from 'form';
import { updateProfile } from 'api';
import { checkRequest } from 'util';


class EditProfilePage extends React.Component {
    state = {
        email: '',
        phone_number: '',
        services: [],
        error: {}
    }

    componentWillReceiveProps({ request }) {
        checkRequest(this.props.request, request, updateProfile,
            () => this.props.router.push('/'),
            error => this.setState({ error })
        );
    }

    componentWillMount() {
        const { current_user } = this.props;
        const { name, organization, email, phone_number } = this.props.current_user;
        const services = current_user.services.slice().map(({ id }) => id);
        this.setState({ name, organization, email, phone_number, services });
    }

    handleCategoryChange = services => this.setState({ services });

    handleInputChange = (name, value) => this.setState({ [name]: value })

    handleFormSubmit = e => {
        e.preventDefault();
        this.setState({ error: {} });
        const { name, organization, email, phone_number, services } = this.state;
        this.props.updateProfile({ name, organization, email, phone_number, services });
    }

    render() {
        const { current_user } = this.props;
        const { name, organization, email, phone_number, services, error } = this.state;
        return (
            <div className="text-center row col-md-offset-3 col-md-6">
                <h1>Edit Profile</h1>
                <br/>
                <form className="form-horizontal" onSubmit={this.handleFormSubmit}>
                    <InputField
                      label="Name"
                      name="name"
                      value={name}
                      errors={error.name}
                      onChange={this.handleInputChange} />
                    <InputField
                      label="Organization"
                      name="organization"
                      value={organization}
                      errors={error.organization}
                      onChange={this.handleInputChange} />
                    <InputField
                      label="Email"
                      name="email"
                      value={email}
                      errors={error.email}
                      onChange={this.handleInputChange} />
                    <InputField
                      label="Phone Number"
                      name="phone_number"
                      value={phone_number}
                      errors={error.phone_number}
                      onChange={this.handleInputChange} />
                    {current_user.role === 'provider' &&
                        <CategoryField
                          label="Capabilities:"
                          values={services}
                          onCategoryChange={this.handleCategoryChange} />
                    }
                    <button className="btn btn-success" type="submit">
                        Submit
                    </button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ current_user, request }) => ({ current_user, request });

export default connect(mapStateToProps, {
    updateProfile
})(withRouter(EditProfilePage));
