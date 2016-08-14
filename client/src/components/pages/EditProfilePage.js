import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField, CategoryField } from 'form';
import { updateProfile } from 'actions';

const { stringify, parse } = JSON;

class EditProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            email: '',
            phone_number: '',
            categories: [],
            error: {}
        }
        this.state = parse(stringify(this.defaultState));
    }

    componentWillMount() {
        let { user } = this.props;
        this.setState({
            email: user.email,
            phone_number: user.phone_number,
            categories: user.capabilities.map(capability => capability.id)
        })
    }

    handleCategoryChange(categories) {
        this.setState({ categories: categories });
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        let { email, phone_number, categories } = this.state;
        this.props.updateProfile({ email, phone_number, categories });
    }

    render() {
        let { user } = this.props;
        return (
            <div className="text-center row col-sm-offset-3 col-sm-6">
                <h1>Edit Profile</h1>
                <br/>
                <form className="form-horizontal" onSubmit={this.handleFormSubmit.bind(this)}>
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
                          value={this.state.categories}
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
        user: state.current_user
    }
}

export default connect(mapStateToProps, {
    updateProfile
})(withRouter(EditProfilePage));