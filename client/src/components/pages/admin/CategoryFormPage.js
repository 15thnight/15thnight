import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField, FormGroup } from 'form';
import {
    createCategory, editCategory, getCategory, deleteCategory,
    clearFormStatus
} from 'actions';

import styles from './CategoryFormPage.css';

class CategoryForm extends React.Component {

    constructor(props) {
        super(props);
        this.defaultState = {
            name: '',
            description: '',
            services: [],
            error: {}
        }

        this.state = this.defaultState;
    }

    componentWillMount() {
        if (this.props.params.id) {
            this.props.getCategory(this.props.params.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.router.push('/manage-categories');
            return this.props.clearFormStatus();
        }
        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError });
            return this.props.clearFormStatus();
        }
        if (this.props.params.id && nextProps.category[this.props.params.id]) {
            let category = nextProps.category[this.props.params.id];
            let { name, description, services } = category;
            services.map((service, key) => service.internalSort = key);
            this.setState({ name, description, services });
        }
    }

    handleDeleteClick() {
        if (confirm('Are you sure you wish to delete this category?')) {
            this.props.deleteCategory(this.props.params.id);
        }
    }

    handleInputChange(name, value) {
        this.setState({ [name]: value });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        let { name, description, services } = this.state;
        services = services.map(service => {
            return {
                id: service.id,
                sort_order: service.internalSort
            }
        })
        let data = { name, description, services }
        this.props.params.id ? this.props.editCategory(this.props.params.id, data) : this.props.createCategory(data);
    }

    handleSort(sorted_service, direction) {
        let { services } = this.state;
        let swapSort = direction === 'up' ? sorted_service.internalSort - 1 : sorted_service.internalSort + 1;
        services.map((service, key) => {
            if (service.internalSort === swapSort) {
                direction === 'up' ? service.internalSort += 1 : service.internalSort -= 1;
            }
        });
        sorted_service.internalSort = swapSort;
        services.sort((a, b) => a.internalSort < b.internalSort ? -1 : 1)
        this.setState({ services });
    }

    renderServices() {
        let { services } = this.state;
        return (
            <FormGroup label="Services">
                <table className="table">
                    <tbody>
                        {services.map((service, key) => {
                            return (
                                <tr key={key}>
                                    <td className={styles.sortColumn}>
                                         {
                                            key !== 0 &&
                                            <span className="btn btn-primary" onClick={this.handleSort.bind(this, service, 'up')}>
                                                <span className="glyphicon glyphicon-chevron-up"></span>
                                            </span>
                                        }
                                    </td>
                                    <td className={styles.sortColumn}>
                                        {
                                            key !== services.length - 1 &&
                                            <span className="btn btn-primary"  onClick={this.handleSort.bind(this, service, 'down')}>
                                                <span className="glyphicon glyphicon-chevron-down"></span>
                                            </span>
                                        }
                                    </td>
                                    <td className={styles.nameColumn}>{service.name}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </FormGroup>
        )
    }

    render() {
        let { services } = this.state;
        return (
            <div className="text-center row col-sm-offset-3 col-sm-6">
                <h1>{ this.props.params.id ? "Edit" : "Create"} Category</h1>
                {
                    this.props.params.id &&
                    <p className="text-right">
                        <span className="btn btn-danger" onClick={this.handleDeleteClick.bind(this)}>Delete Category</span>
                    </p>
                }
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
                    {
                        services.length > 0 &&
                        this.renderServices()
                    }
                    <button className="btn btn-success" type="submit">
                        { this.props.params.id ? "Submit" : "Create" } Category
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