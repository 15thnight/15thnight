import React from 'react';
import { connect } from 'react-redux';

import { getCategories } from 'actions';
import FormGroup from './FormGroup';
import styles from './CategoryField.css';


class CategoryField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            categories: []
        }
    }

    componentWillMount() {
        this.props.getCategories();
    }

    handleCheckboxChange(e) {
        let categories = this.props.value;
        let id = parseInt(e.target.value);
        if (categories.indexOf(id) < 0) {
            categories.push(id)
        } else {
            categories = categories.filter(category => category !== id);
        }
        this.setState({
            categories: categories.slice(0)
        });
        this.props.onCategoryChange(categories);
    }

    render() {
        if (!this.props.categories) {
            return (<FormGroup>Loading Categories...</FormGroup>);
        }
        let { label, value } = this.props;
        return (
            <FormGroup label={label}>
                {this.props.categories.map(category => {
                    if (category.services.length === 0) {
                        return null;
                    }
                    return (
                        <div key={category.id} className={styles.categoryField}>
                            <h4 className={styles.categoryHeader}>{category.name}</h4>
                            {category.services.map(service => (
                                <div key={service.id} className="checkbox">
                                    <label>
                                        <input
                                          type="checkbox"
                                          value={service.id}
                                          checked={value.indexOf(service.id) >= 0}
                                          onChange={(e) => this.handleCheckboxChange(e)}
                                        />
                                        {service.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </FormGroup>
        );
    }
}

function mapStateToProps(state) {
    return {
        categories: state.categories
    }
}

export default connect(mapStateToProps, {
    getCategories
}, null, { withRef: true })(CategoryField);