import React from 'react';
import { connect } from 'react-redux';

import { getCategories } from 'api';
import FormGroup from './FormGroup';
import classes from './CategoryField.css';


@connect(({ categories }) => ({ categories }), { getCategories })
export default class CategoryField extends React.Component {
    componentWillMount() {
        this.props.getCategories();
    }

    handleCheckboxChange = e => {
        const { values } = this.props;
        const id = parseInt(e.target.value);
        this.props.onCategoryChange(
            values.indexOf(id) < 0 ? values.concat(id) : values.filter(v => v !== id));
    }

    render() {
        const { label, values, categories } = this.props;
        if (!categories) {
            return (<FormGroup>Loading Categories...</FormGroup>);
        }
        return (
            <FormGroup label={label}>
                {categories.filter(c => c.services.length !== 0).map(({ id, name, services}) => (
                    <div key={id} className={classes.categoryField}>
                        <h4 className={classes.categoryHeader}>{name}</h4>
                        {services.map(({ id, name }) => (
                            <div key={id} className="checkbox">
                                <label>
                                    <input
                                      type="checkbox"
                                      value={id}
                                      checked={values.indexOf(id) >= 0}
                                      onChange={this.handleCheckboxChange}
                                    />
                                    {name}
                                </label>
                            </div>
                        ))}
                    </div>
                ))}
            </FormGroup>
        );
    }
}
