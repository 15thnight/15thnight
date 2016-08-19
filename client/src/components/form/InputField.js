import React from 'react';

import FormErrors from './FormErrors';
import FormGroup from './FormGroup';

class InputField extends React.Component {
    constructor(props) {
        super(props);
        this.defaultProps = {
            type: 'text',
            errors: []
        }
    }

    handleChange(e) {
        this.props.onChange(this.props.name, e.target.value);
    }

    componentDidMount() {
        let { type, values, value, name } = this.props;
        if (type === 'select' && values.indexOf(value) < 0) {
            this.props.onChange(name, values[0][0])
        }
    }

    render() {
        let { type, name, label, errors } = this.props;
        label += ':';
        let input = (
            <input
              id={name}
              type={type}
              className="form-control"
              value={this.props.value}
              onChange={this.handleChange.bind(this)} />
        );
        if (type === 'textarea') {
            input = (
                <textarea
                  id={name}
                  className="form-control"
                  value={this.props.value}
                  onChange={this.handleChange.bind(this)}></textarea>
            );
        } else if (type === 'select') {
            input = (
                <select
                  id={name}
                  className="form-control"
                  value={this.props.value}
                  onChange={this.handleChange.bind(this)}>
                    {this.props.values.map((value, key) => {
                        return (<option key={key} value={value[0]}>{value[1]}</option>);
                    })}
                </select>
            );
        }
        return (
            <FormGroup htmlFor={name} label={label}>
                {input}
                <FormErrors errors={errors} />
                {this.props.children}
            </FormGroup>
        )
    }
}

//InputField.defaultProps = {

//}

export default InputField;