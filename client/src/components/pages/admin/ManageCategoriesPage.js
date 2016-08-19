import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { getCategories, setCategorySort } from 'actions';

import styles from './ManageCategoriesPage.css';


class ManageCategories extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: null
        }
    }

    componentWillMount() {
        this.props.getCategories();
    }

    componentWillReceiveProps(nextProps) {
        let { categories } = nextProps;
        categories.map((category, key) => {
            category.internalSort = key;
        });
        this.setState({ categories: nextProps.categories });
    }

    handleSort(sorted_category, direction) {
        let { categories } = this.state;
        let swapSort = direction === 'up' ? sorted_category.internalSort - 1 : sorted_category.internalSort + 1;
        categories.map((category, key) => {
            if (category.internalSort === swapSort) {
                direction === 'up' ? category.internalSort += 1 : category.internalSort -= 1;
            }
        });
        sorted_category.internalSort = swapSort;
        categories.sort((a, b) => a.internalSort < b.internalSort ? -1 : 1)
        this.setState({ categories });
        this.setSortOrder();
    }

    setSortOrder() {
        const categories = this.state.categories.map(category => {
            return {
            id: category.id,
            sort_order: category.internalSort
        }});
        this.props.setCategorySort({ categories });
    }

    render() {
        let categories = this.state.categories || [];
        return (
            <div className="tab-pane" id="manage-users">
                <h1 className="text-center">Manage Categories</h1>
                <div className="text-right">
                    <Link to="/add-category" className="btn btn-success">Add Category</Link>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th colSpan="2" className="text-center">Sort</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { categories.map((category, key) => {
                            return (
                                <tr key={category.id}>
                                    <td className={styles.sortColumn}>
                                        {
                                            key !== 0 &&
                                            <button className="btn btn-primary" onClick={this.handleSort.bind(this, category, 'up')}>
                                                <span className="glyphicon glyphicon-chevron-up"></span>
                                            </button>
                                        }
                                    </td>
                                    <td className={styles.sortColumn}>
                                        {
                                            key !== categories.length - 1 &&
                                            <button className="btn btn-primary"  onClick={this.handleSort.bind(this, category, 'down')}>
                                                <span className="glyphicon glyphicon-chevron-down"></span>
                                            </button>
                                        }
                                    </td>
                                    <td>{category.name}</td>
                                    <td>{category.description}</td>
                                    <td><Link to={"/edit-category/" + category.id} className="btn btn-primary">Edit</Link></td>
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
    getCategories,
    setCategorySort
})(ManageCategories);