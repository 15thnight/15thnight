import React from 'react';
import { connect } from 'react-redux';

import { getCategories } from 'actions';

import FormGroup from './FormGroup';

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
        let field = (
            this.props.categories.map(category => {
                return (
                    <div key={category.id} className="checkbox">
                        <label>
                            <input
                              type="checkbox"
                              value={category.id}
                              checked={value.indexOf(category.id) >= 0}
                              onChange={this.handleCheckboxChange.bind(this)}/>
                            {category.name}
                        </label>
                    </div>
                );
            })
        )
        return (
            <FormGroup label={label}>{field}</FormGroup>
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