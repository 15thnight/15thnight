import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { DeleteConfirmForm, Form, InputField, StaticField } from 'c/form';
import {
    createService,
    editService,
    getService,
    deleteService,
    getCategories,
} from 'api';
import { withRequests } from 'react-requests';


@withRequests
@withRouter
@connect(
    ({ service, categories }, { params: { id }}) => ({ categories, id, service: service[id] }),
    { createService, editService, deleteService, getService, getCategories }
)
export default class ServiceForm extends React.Component {
    state = {
        name: '',
        description: '',
        category: '',
        deleting: false,
        error: {}
    }

    componentWillMount() {
        this.props.getCategories();
        const { id } = this.props.params;
        if (id) {
            this.props.getService({ id });
        }
        this.props.observeRequest([createService, editService, deleteService], {
            end: () => this.props.router.push('/manage-services'),
            error: error => this.setState({ error })
        });
    }

    componentWillReceiveProps({ service }) {
        if (this.props.service !== service && service) {
            const { name, description, category: { id: category } } = service;
            this.setState({ name, description, category });
        }
    }

    handleInputChange = (name, value) => this.setState({ [name]: value });

    handleSubmit = e => {
        this.setState({ error: {} });
        const { name, description, category } = this.state;
        const data = { name, description, category };
        const { id } = this.props;
        id ? this.props.editService({ id, data }) : this.props.createService({ data });
    }

    renderDeleteConfirm = ({ id, name, description, category }) => (
        <DeleteConfirmForm
          title='Service'
          onCancel={e => this.setState({ deleting: false })}
          onConfirm={e => this.props.deleteService({ id })}
        >
            <StaticField label='Name'>{name}</StaticField>
            <StaticField label='Description'>{description}</StaticField>
            <StaticField label='Category'>{category.name}</StaticField>
        </DeleteConfirmForm>
    );

    render() {
        if (this.state.deleting) {
            return this.renderDeleteConfirm(this.props.service);
        }
        const { categories, id, service } = this.props;
        if (!categories || (id && !service)) {
            return (<h1 className="text-center">Loading...</h1>);
        }
        const categoryOptions = categories.map(({ id, name }) => ({ value: id, label: name }));
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>{id ? "Edit" : "Create"} Service</h1>
                {id &&
                    <p className="text-right">
                        <div className="btn btn-danger" onClick={e => this.setState({ deleting: true })}>Delete Service</div>
                    </p>
                }
                <InputField
                  label="Name"
                  name="name"
                  value={this.state.name}
                  errors={this.state.error.name}
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
                <InputField
                  type="select"
                  label="Category"
                  name="category"
                  value={this.state.category}
                  options={categoryOptions}
                  errors={this.state.error.category}
                  onChange={this.handleInputChange}
                />
                <button className="btn btn-success" type="submit">
                    {id ? "Submit" : "Create" } Service
                </button>
            </Form>
        )
    }
}
