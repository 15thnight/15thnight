import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'seamless-immutable';

import { getCategories, setCategorySort } from 'api';
import Button from 'c/button';
import { Sortable } from 'c/form';
import { ManageHeader } from 'c/manage';
import Table from 'c/table';

import classes from './ManageCategoriesPage.css';


@connect(({ categories }) => ({ categories }), { getCategories, setCategorySort })
export default class ManageCategoriesPage extends React.Component {
    state = {
        categories: null
    }

    componentWillMount() {
        this.props.getCategories();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.categories !== nextProps.categories && nextProps.categories) {
            const categories = Immutable(nextProps.categories.map((c, tmpSort) => c.merge({ tmpSort })));
            this.setState({ categories });
        }
    }

    handleSort = categories => {
        const sorted_ids = categories.map(({ id, tmpSort: sort_order }) => ({ id, sort_order }));
        const data = { sorted_ids };
        this.props.setCategorySort({ data });
        this.setState({ categories });
    }

    render() {
        const { categories } = this.state;
        if (!categories) {
            return (<div><h1 className="text-center">Loading Categories...</h1></div>);
        }
        return (
            <div>
                <ManageHeader title='Categories' entity='Category' addRoute='/add-category' />
                <Table>
                    <Table.Header>
                        <th className="text-center">Sort</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th></th>
                    </Table.Header>
                    {categories.map(({ id, tmpSort, name, description }, idx) => (
                        <Table.Row key={id}>
                            <td>
                                <Sortable
                                  items={categories}
                                  tmpSort={tmpSort}
                                  idx={idx}
                                  onSort={this.handleSort}
                                />
                            </td>
                            <td>{name}</td>
                            <td>{description}</td>
                            <td><Button to={`/edit-category/${id}`}>Edit</Button></td>
                        </Table.Row>
                    ))}
                </Table>
            </div>
        )
    }
}
