import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Form, InputField, CategoryField, Loading } from 'c/form';
import { getCurrentUser, updateProfile} from 'api';
import { withRequests } from 'react-requests';


@withRouter
@withRequests
@connect(({ current_user }) => ({ current_user }), { getCurrentUser, updateProfile })
export default class EditProfilePage extends React.Component {
    state = {
        loading: true,
        email: '',
        phone_number: '',
        services: [],
        error: {}
    }

    componentWillMount() {
        this.props.observeRequest(updateProfile, {
            end: () => this.props.router.push('/'),
            error: error => this.setState({ error })
        });
        this.props.observeRequest(getCurrentUser, { end: this.loadedData });
        this.props.getCurrentUser()
    }

    loadedData = ({ name, organization, email, phone_number, services }) => {
        services = services.slice().map(({ id }) => id);
        this.setState({ name, organization, email, phone_number, services, loading: false });
    }

    handleCategoryChange = services => this.setState({ services });

    handleInputChange = (name, value) => this.setState({ [name]: value })

    handleSubmit = e => {
        this.setState({ error: {} });
        const { name, organization, email, phone_number, services } = this.state;
        const data = { name, organization, email, phone_number, services };
        this.props.updateProfile({ data });
    }

    render() {
        if (this.state.loading) {
            return (<Loading title="Your Profile" />)
        }
        const { current_user } = this.props;
        const { name, organization, email, phone_number, services, error } = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>Edit Profile</h1>
                <br/>
                <InputField
                  label="Name"
                  name="name"
                  value={name}
                  errors={error.name}
                  onChange={this.handleInputChange}
                />
                <InputField
                  label="Organization"
                  name="organization"
                  value={organization}
                  errors={error.organization}
                  onChange={this.handleInputChange}
                />
                <InputField
                  label="Email"
                  name="email"
                  value={email}
                  errors={error.email}
                  onChange={this.handleInputChange}
                />
                <InputField
                  label="Phone Number"
                  name="phone_number"
                  type="phone"
                  value={phone_number}
                  errors={error.phone_number}
                  onChange={this.handleInputChange}
                />
                {current_user.role === 'provider' &&
                    <CategoryField
                      label="Capabilities"
                      values={services}
                      onCategoryChange={this.handleCategoryChange} />
                }
                <button className="btn btn-success" type="submit">
                    Submit
                </button>
            </Form>
        )
    }
}
