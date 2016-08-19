import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { CategoryField, InputField } from 'form';

import {
    sendAlert, clearFormStatus
} from 'actions';

const { parse, stringify } = JSON;

class AlertForm extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            description: '',
            gender: 'male',
            age: '',
            categories: [],
            needs: [],
            error: {}
        }

        this.state = parse(stringify(this.defaultState));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.setState(parse(stringify(this.defaultState)));
            return this.props.clearFormStatus();
        }
        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError });
            return this.props.clearFormStatus();
        }
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
        let data = {
            description: this.state.description,
            age: this.state.age,
            gender: this.state.gender,
            needs: this.state.categories
        }
        this.props.sendAlert(data);
    }

    handleTogglePassword() {
        this.setState({ editingPassword: !this.state.editingPassword });
    }

    render() {
        const genders = [
            ['male',        'Male'],
            ['female',      'Female'],
            ['unspecified', 'Unspecified']
        ];
        return (
            <div className="text-center row col-sm-offset-3 col-sm-6">
                <h1>Send an Alert</h1>
                { this.props.id &&
                    <div className="text-right">
                        <div className="btn btn-danger" onClick={this.handleDeleteClick.bind(this)}>Delete Category</div>
                    </div> }
                <form className="form-horizontal" onSubmit={this.handleFormSubmit.bind(this)}>
                    <InputField
                      label="Age"
                      name="age"
                      value={this.state.age}
                      errors={this.state.error.age}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      type="select"
                      label="Gender"
                      name="gender"
                      value={this.state.gender}
                      values={genders}
                      errors={this.state.error.gender}
                      onChange={this.handleInputChange.bind(this)} />
                    <CategoryField
                      label="Needs:"
                      value={this.state.categories}
                      onCategoryChange={this.handleCategoryChange.bind(this)} />
                    <InputField
                      type="textarea"
                      label="Description"
                      name="description"
                      value={this.state.description}
                      errors={this.state.error.description}
                      onChange={this.handleInputChange.bind(this)} />
                    <button className="btn btn-success" type="submit">
                        Send Alert
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
   clearFormStatus,
   sendAlert
})(withRouter(AlertForm));