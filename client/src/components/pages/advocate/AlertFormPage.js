import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Button from 'c/button';
import { CategoryField, Form, FormErrors, InputField } from 'c/form';
import { sendAlert } from 'api';
import { withRequests } from 'react-requests';


const GENDER_OPTIONS = [
    { value: 'male',        label: 'Male' },
    { value: 'female',      label: 'Female' },
    { value: 'unspecified', label: 'Unspecified' }
];

const DEFAULT_STATE = {
    description: '',
    gender: 'male',
    age: '',
    needs: [],
    error: {}
}

@withRouter
@withRequests
@connect(null, { sendAlert })
export default class AlertForm extends React.Component {
    state = Object.assign({}, DEFAULT_STATE);

    componentDidMount() {
        this.props.observeRequest(sendAlert, {
            end: () => this.setState(DEFAULT_STATE),
            error: error => this.setState({ error })
        })
    }

    handleCategoryChange = needs => this.setState({ needs });

    handleInputChange = (name, value) => this.setState({ [name]: value });

    handleSubmit = e => {
        this.setState({ error: {} });
        const { description, age, gender, needs } = this.state;
        const data = { description, age, gender, needs };
        this.props.sendAlert({ data });
    }

    handleTogglePassword = () =>
        this.setState({ editingPassword: !this.state.editingPassword });


    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>Send an Alert</h1>
                {this.props.id &&
                    <div className="text-right">
                        <div className="btn btn-danger" onClick={this.handleDeleteClick}>Delete Category</div>
                    </div>
                }
                <Button style="success" lg>Send Alert</Button>
                <br/>
                <br/>
                <InputField
                  label="Age"
                  name="age"
                  value={this.state.age}
                  errors={this.state.error.age}
                  onChange={this.handleInputChange}
                />
                <InputField
                  type="select"
                  label="Gender"
                  name="gender"
                  value={this.state.gender}
                  options={GENDER_OPTIONS}
                  errors={this.state.error.gender}
                  onChange={this.handleInputChange}
                />
                <InputField
                  type="textarea"
                  label="Description"
                  name="description"
                  value={this.state.description}
                  errors={this.state.error.description}
                  onChange={this.handleInputChange}
                />
                <FormErrors errors={this.state.error.needs} />
                <CategoryField
                  label="Needs"
                  values={this.state.needs}
                  onCategoryChange={this.handleCategoryChange}
                />
                <FormErrors errors={this.state.error.needs} />
                <Button style="success" lg>Send Alert</Button>
            </Form>
        )
    }
}
