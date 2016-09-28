import React from 'react';

import FormErrors from './FormErrors';
import FormGroup from './FormGroup';

class Input extends React.Component {
    constructor(props) {
        super(props);
        this.defaultProps = {
            type: 'text',
            disabled: false
        }
    }

    handleChange(e) {
        this.props.onChange(this.props.name, e.target.value, e);
    }

    handleFocus(e) {
        if (this.props.onFocus) {
            this.props.onFocus(e);
        }
    }

    handleClick(e) {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
    }

    componentDidMount() {
        let { type, values, value, name } = this.props;
        if (type === 'select' && values.indexOf(value) < 0) {
            this.props.onChange(name, values[0][0])
        }
    }

    render() {
        let { type, name } = this.props;
        let input = (
            <input
              ref="input"
              id={name}
              type={type}
              checked={this.props.checked}
              className={type !== 'checkbox' && "form-control"}
              value={this.props.value}
              disabled={this.props.disabled}
              onClick={this.handleClick.bind(this)}
              onChange={this.handleChange.bind(this)}
              onFocus={this.handleFocus.bind(this)} />
        );
        if (type === 'textarea') {
            input = (
                <textarea
                  ref="input"
                  id={name}
                  placeholder={this.props.placeholder}
                  className="form-control"
                  value={this.props.value}
                  disabled={this.props.disabled}
                  onClick={this.handleClick.bind(this)}
                  onChange={this.handleChange.bind(this)}
                  onFocus={this.handleFocus.bind(this)}></textarea>
            );
        } else if (type === 'select') {
            input = (
                <select
                  ref="input"
                  id={name}
                  className="form-control"
                  value={this.props.value}
                  onClick={this.handleClick.bind(this)}
                  onChange={this.handleChange.bind(this)}
                  onFocus={this.handleFocus.bind(this)}>
                    {this.props.values.map((value, key) => {
                        return (<option key={key} value={value[0]}>{value[1]}</option>);
                    })}
                </select>
            );
        }
        return input;
    }
}

//Input.defaultProps = {

//}

export default Input;