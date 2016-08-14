import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField } from 'form';
import {
    createCategory, editCategory, getCategory, deleteCategory,
    clearFormStatus
} from 'actions';

class CategoryForm extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            name: '',
            description: '',
            error: {}
        }

        this.state = this.defaultState;
    }

    componentWillMount() {
        if (this.props.id) {
            this.props.getCategory(this.props.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.router.push('/dashboard/manage-categories');
            return this.props.clearFormStatus();
        }
        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError });
            return this.props.clearFormStatus();
        }
        if (this.props.id !== nextProps.id) {
            return this.setState(this.defaultState);
        }
        if (this.props.id && nextProps.category[this.props.id]) {
            let category = nextProps.category[this.props.id];
            this.setState({
                name: category.name,
                description: category.description
            });
        }
    }

    handleDeleteClick() {
        if (confirm('Are you sure you wish to delete this category?')) {
            this.props.deleteCategory(this.props.id);
        }
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        let data = {
            name: this.state.name,
            description: this.state.description
        }
        this.props.id ? this.props.editCategory(this.props.id, data) : this.props.createCategory(data);
    }

    render() {
        return (
            <div className="text-center row col-sm-offset-3 col-sm-6">
                <h1>{ this.props.id ? "Edit" : "Create"} Category</h1>
                { this.props.id &&
                    <p className="text-right">
                        <div className="btn btn-danger" onClick={this.handleDeleteClick.bind(this)}>Delete Category</div>
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
                    <button className="btn btn-success" type="submit">
                        { this.props.id ? "Submit" : "Create" } Category
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
        category: state.category
    }
}

export default connect(mapStateToProps, {
    createCategory,
    editCategory,
    deleteCategory,
    clearFormStatus,
    getCategory
})(withRouter(CategoryForm));