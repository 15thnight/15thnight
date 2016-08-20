import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField } from 'form';
import {
    createService, editService, getService, deleteService,
    getCategories,
    clearFormStatus
} from 'actions';

class ServiceForm extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            name: '',
            description: '',
            category: '',
            error: {}
        }

        this.state = this.defaultState;
    }

    componentWillMount() {
        this.props.getCategories();
        if (this.props.id) {
            this.props.getService(this.props.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.router.push('/dashboard/manage-services');
            return this.props.clearFormStatus();
        }
        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError });
            return this.props.clearFormStatus();
        }
        if (this.props.id && nextProps.service[this.props.id]) {
            let service = nextProps.service[this.props.id];
            this.setState({
                name: service.name,
                description: service.description,
                category: service.category
            });
        }
    }

    handleDeleteClick() {
        if (confirm('Are you sure you wish to delete this service?')) {
            this.props.deleteService(this.props.id);
        }
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        let { name, description, category } = this.state;
        let data = { name, description, category };
        this.props.id ? this.props.editService(this.props.id, data) : this.props.createService(data);
    }

    render() {
        if (!this.props.categories) {
            return (<h1 className="text-center">Loading Categories...</h1>);
        }
        let categories = this.props.categories.map(category => [category.id, category.name])
        return (
            <div className="text-center row col-sm-offset-3 col-sm-6">
                <h1>{ this.props.id ? "Edit" : "Create"} Service</h1>
                { this.props.id &&
                    <p className="text-right">
                        <div className="btn btn-danger" onClick={this.handleDeleteClick.bind(this)}>Delete Service</div>
                    </p> }
                <form className="form-horizontal" onSubmit={this.handleFormSubmit.bind(this)}>
                    <InputField
                      label="Name"
                      name="name"
                      value={this.state.name}
                      errors={this.state.error.name}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      type="textarea"
                      label="Description"
                      name="description"
                      value={this.state.description}
                      errors={this.state.error.description}
                      onChange={this.handleInputChange.bind(this)} />
                    <InputField
                      type="select"
                      label="Category"
                      name="category"
                      value={this.state.category}
                      values={categories}
                      errors={this.state.error.category}
                      onChange={this.handleInputChange.bind(this)} />
                    <button className="btn btn-success" type="submit">
                        { this.props.id ? "Submit" : "Create" } Service
                    </button>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        submitFormError: state.submitFormError,
        submitFormSuccess: state.submitFormSuccess,
        service: state.service,
        categories: state.categories
    }
}

export default connect(mapStateToProps, {
    createService,
    editService,
    deleteService,
    clearFormStatus,
    getService,
    getCategories
})(withRouter(ServiceForm));