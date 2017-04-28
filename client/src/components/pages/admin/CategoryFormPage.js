import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField, FormGroup } from 'form';
import {
    createCategory,
    editCategory,
    getCategory,
    deleteCategory,
} from 'api';
import { checkRequest } from 'util';

import styles from './CategoryFormPage.css';

class CategoryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            services: [],
            error: {}
        }
    }

    componentWillMount() {
        if (this.props.id) {
            this.props.getCategory(this.props.id);
        }
    }

    componentWillReceiveProps({ request, category }) {
        if (checkRequest(this.props.request, request,
                (this.props.id ? editCategory : createCategory).symbol,
                () => this.props.router.push('/manage-categories'),
                error => this.setState({ error }))) {
            return;
        }
        if (category && this.props.category !== category) {
            const { name, description } = category;
            const services = category.services.slice();
            services.forEach((service, key) => service.internalSort = key);
            this.setState({ name, description, services });
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
        let { name, description, services } = this.state;
        services = services.map(service => {
            return {
                id: service.id,
                sort_order: service.internalSort
            }
        })
        let data = { name, description, services }
        this.props.id ? this.props.editCategory(this.props.id, data) : this.props.createCategory(data);
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
        const { services } = this.state;
        return (
            <div className="text-center row col-md-offset-3 col-md-6">
                <h1>{ this.props.id ? "Edit" : "Create"} Category</h1>
                {
                    this.props.id &&
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
                    {services.length > 0 &&
                        this.renderServices()
                    }
                    <button className="btn btn-success" type="submit">
                        { this.props.id ? "Submit" : "Create" } Category
                    </button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ category, request }, { params: { id }}) =>
    ({ category: category[id], request, id });

export default connect(mapStateToProps, {
    createCategory,
    editCategory,
    deleteCategory,
    getCategory
})(withRouter(CategoryForm));
