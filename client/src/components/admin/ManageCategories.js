import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getCategories } from 'actions';


class ManageCategories extends React.Component {

    componentWillMount() {
        this.props.getCategories();
    }

    render() {
        let categories = this.props.categories || [];
        return (
            <div className="tab-pane" id="manage-users">
                <h1 className="text-center">Manage Categories</h1>
                <div className="text-right">
                    <Link to="/dashboard/add-category" className="btn btn-success">Add Category</Link>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { categories.map(category => {
                            return (
                                <tr key={category.id}>
                                    <td>{category.name}</td>
                                    <td>{category.description}</td>
                                    <td><Link to={"/dashboard/edit-category/" + category.id} className="btn btn-primary">Edit</Link></td>
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
        categories: state.categories
    }
}

export default connect(mapStateToProps, {
    getCategories
})(ManageCategories);