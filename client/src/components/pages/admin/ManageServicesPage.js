import React from 'react';
import { connect } from 'react-redux';

import { getServices } from 'api';
import Button from 'c/button';
import { ManageHeader } from 'c/manage';
import Table from 'c/table';


@connect(({ services }) => ({ services }), { getServices })
export default class ManageServices extends React.Component {
    componentWillMount() {
        this.props.getServices();
    }

    render() {
        const { services } = this.props;
        if (!services) {
            return null;
        }
        return (
            <div>
                <ManageHeader title="Services" entity="Service" addRoute="/add-service" />
                <Table>
                    <Table.Header>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th></th>
                    </Table.Header>
                    {services.map(({ id, name, description, category }) => (
                        <Table.Row key={id}>
                            <td>{name}</td>
                            <td>{description}</td>
                            <td>{category.name}</td>
                            <td><Button to={`/edit-service/${id}`}>Edit</Button></td>
                        </Table.Row>
                    ))}
                </Table>
            </div>
        )
    }
}
