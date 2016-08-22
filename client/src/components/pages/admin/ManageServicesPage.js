import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getServices } from 'actions';


class ManageServices extends React.Component {

    componentWillMount() {
        this.props.getServices();
    }

    render() {
        let services = this.props.services || [];
        return (
            <div className="tab-pane" id="manage-users">
                <h1 className="text-center">Manage Services</h1>
                <div className="text-right">
                    <Link to="/add-service" className="btn btn-success">Add Services</Link>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { services.map(service => {
                            return (
                                <tr key={service.id}>
                                    <td>{service.name}</td>
                                    <td>{service.description}</td>
                                    <td>{service.category.name}</td>
                                    <td><Link to={"/edit-service/" + service.id} className="btn btn-primary">Edit</Link></td>
                                </tr>
                            )
                        }) }
                </tbody>
            </table>
        </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        services: state.services
    }
}

export default connect(mapStateToProps, {
    getServices
})(ManageServices);