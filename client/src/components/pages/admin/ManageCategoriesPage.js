import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Immutable from 'seamless-immutable';

import { getCategories, setCategorySort } from 'api';

import styles from './ManageCategoriesPage.css';


class ManageCategoriesPage extends React.Component {
    state = {
        categories: null
    }

    componentWillMount() {
        this.props.getCategories();
    }

    componentWillReceiveProps(nextProps) {
        const categories = Immutable(nextProps.categories.slice()
            .map((c, internalSort) => c.merge({ internalSort })));
        this.setState({ categories });
    }

    handleSort = (sortToSwap, direction) => {
        const isUp = direction === 'up';
        const swapSort = sortToSwap + (isUp ?  -1 : 1);
        const categories = Immutable([].concat(this.state.categories.map(category => {
            const { internalSort } = category;
            if (internalSort === swapSort) {
                return category.merge({
                    internalSort: internalSort + (isUp ? 1 : -1)
                });
            } else if (internalSort === sortToSwap) {
                return category.merge({ internalSort: swapSort });
            }
            return category;
        })).sort((a, b) => a.internalSort - b.internalSort));
        this.setState({ categories }, this.setSortOrder);
    }

    setSortOrder = () => {
        const categories = this.state.categories
            .map(({ id, internalSort: sort_order }) => ({ id, sort_order }));
        this.props.setCategorySort({ categories });
    }

    render() {
        const { categories } = this.state;
        if (!categories) {
            return (<div><h1 className="text-center">Loading Categories</h1></div>);
        }
        return (
            <div className="tab-pane" id="manage-users">
                <h1 className="text-center">Manage Categories</h1>
                <div className="text-right">
                    <Link to="/add-category" className="btn btn-success">Add Category</Link>
                </div>
                <div className="table-responsive">
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
                            {categories.map(({ id, internalSort, name, description }, key) => (
                                <tr key={id}>
                                    <td className={styles.sortColumn}>
                                        {key !== 0 &&
                                            <button className="btn btn-primary" onClick={() => this.handleSort(internalSort, 'up')}>
                                                <span className="glyphicon glyphicon-chevron-up"></span>
                                            </button>
                                        }
                                    </td>
                                    <td className={styles.sortColumn}>
                                        {key !== categories.length - 1 &&
                                            <button className="btn btn-primary"  onClick={() => this.handleSort(internalSort, 'down')}>
                                                <span className="glyphicon glyphicon-chevron-down"></span>
                                            </button>
                                        }
                                    </td>
                                    <td>{name}</td>
                                    <td>{description}</td>
                                    <td><Link to={`/edit-category/${id}`} className="btn btn-primary">Edit</Link></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
        )
    }
}

const mapStateToProps = ({ categories }) => ({ categories });

export default connect(mapStateToProps, {
    getCategories,
    setCategorySort
})(ManageCategoriesPage);
