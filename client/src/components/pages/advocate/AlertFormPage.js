import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { CategoryField, FormErrors, InputField } from 'form';
import { sendAlert } from 'api';
import { checkRequest } from 'util';

const GENDER_VALUES = [
    ['male',        'Male'],
    ['female',      'Female'],
    ['unspecified', 'Unspecified']
];

const DEFAULT_STATE = {
    description: '',
    gender: 'male',
    age: '',
    needs: [],
    error: {}
}

class AlertForm extends React.Component {
    state = Object.assign({}, DEFAULT_STATE);

    componentWillReceiveProps({ request }) {
        checkRequest(this.props.request, request, sendAlert,
            () => this.setState(DEFAULT_STATE),
            error => this.setState({ error })
        )
    }

    handleCategoryChange = needs => this.setState({ needs });

    handleInputChange = (name, value) => this.setState({ [name]: value });

    handleFormSubmit = e => {
        e.preventDefault();
        this.setState({ error: {} });
        const { description, age, gender, needs } = this.state;
        this.props.sendAlert({ description, age, gender, needs });
    }

    handleTogglePassword = () =>
        this.setState({ editingPassword: !this.state.editingPassword });


    render() {
        return (
            <div className="text-center row col-md-offset-3 col-md-6">
                <h1>Send an Alert</h1>
                { this.props.id &&
                    <div className="text-right">
                        <div className="btn btn-danger" onClick={this.handleDeleteClick}>Delete Category</div>
                    </div> }
                <form className="form-horizontal" onSubmit={this.handleFormSubmit}>
                    <button className="btn btn-success" type="submit">
                        Send Alert
                    </button>
                    <br/>
                    <InputField
                      label="Age"
                      name="age"
                      value={this.state.age}
                      errors={this.state.error.age}
                      onChange={this.handleInputChange} />
                    <InputField
                      type="select"
                      label="Gender"
                      name="gender"
                      value={this.state.gender}
                      values={GENDER_VALUES}
                      errors={this.state.error.gender}
                      onChange={this.handleInputChange} />
                    <InputField
                      type="textarea"
                      label="Description"
                      name="description"
                      value={this.state.description}
                      errors={this.state.error.description}
                      onChange={this.handleInputChange} />
                    <FormErrors errors={this.state.error.needs} />
                    <CategoryField
                      label="Needs:"
                      values={this.state.needs}
                      onCategoryChange={this.handleCategoryChange} />
                    <FormErrors errors={this.state.error.needs} />
                    <button className="btn btn-success" type="submit">
                        Send Alert
                    </button>
                </form>
            </div>
        )
    }
}


const mapStateToProps = ({ request }) => ({ request });

export default connect(mapStateToProps, {
   sendAlert
})(withRouter(AlertForm));
