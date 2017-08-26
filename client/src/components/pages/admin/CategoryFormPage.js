import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { createCategory, editCategory, getCategory, deleteCategory } from 'api';
import { withRequests } from 'react-requests';
import { DeleteConfirmForm, Form, InputField, FormGroup, Sortable, StaticField } from 'c/form';

import classes from './CategoryFormPage.css';


@withRouter
@withRequests
@connect(
    ({ category, request }, { params: { id }}) =>
        ({ category: category[id], request, id }),
    { createCategory, editCategory, getCategory, deleteCategory }
)
export default class CategoryForm extends React.Component {
    state = {
        name: '',
        description: '',
        services: [],
        error: {},
        deleting: false
    }

    componentWillMount() {
        const { id } = this.props;
        if (id) {
            this.props.getCategory({ id });
        }
        this.props.observeRequest([editCategory, createCategory, deleteCategory], {
            end: () => this.props.router.push('/manage-categories'),
            error: error => this.setState({ error })
        });
    }

    componentWillReceiveProps({ request, category }) {
        if (category && this.props.category !== category) {
            const { name, description } = category;
            const services = category.services.map((s, tmpSort) => s.merge({ tmpSort }));
            this.setState({ name, description, services });
        }
    }

    handleInputChange = (name, value) => this.setState({ [name]: value });

    handleSubmit = e => {
        this.setState({ error: {} });
        const services = this.state.services.map(({ id }) => id);
        const { name, description } = this.state;
        const { id } = this.props;
        const data = { name, description, services }
        id ? this.props.editCategory({ data, id }) : this.props.createCategory({ data });
    }

    renderServices = services => (
        <FormGroup label="Services">
            {services.map((service, idx) =>
                <div key={idx} className={classes.service}>
                    <Sortable
                      items={services}
                      idx={idx}
                      tmpSort={service.tmpSort}
                      onSort={services => this.setState({ services })}
                    />
                    <div>{service.name}</div>
                </div>
            )}
        </FormGroup>
    )

    renderDeleteConfirm = ({ id, name, description, services }) => (
        <DeleteConfirmForm
          title='Category'
          onCancel={e => this.setState({ deleting: false })}
          onConfirm={e => this.props.deleteCategory({ id })}
        >
            <StaticField label='Name'>{name}</StaticField>
            <StaticField label='Description'>{description}</StaticField>
            {services.length > 0 &&
                <StaticField>Deleting this category will also delete the following services:</StaticField>
            }
            <StaticField><ul>{services.map((service, idx) => <li idx={idx}>{service.name}</li>)}</ul></StaticField>
        </DeleteConfirmForm>
    )

    render() {
        if (this.state.deleting) {
            return this.renderDeleteConfirm(this.props.category);
        }
        if (!this.state.services) {
            return 'Loading';
        }
        const { services } = this.state;
        const { id } = this.props;
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>{id ? "Edit" : "Create"} Category</h1>
                {id &&
                    <p className="text-right">
                        <span className="btn btn-danger" onClick={() => this.setState({ deleting: true })}>Delete Category</span>
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
                {services.length > 0 && this.renderServices(services)}
                <button className="btn btn-success" type="submit">
                    {id ? "Submit" : "Create"} Category
                </button>
            </Form>
        )
    }
}
