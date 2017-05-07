import React from 'react';

import FormErrors from './FormErrors';
import FormGroup from './FormGroup';

import classes from './Input.css';

const formatPhone = p =>
    [p[0],p[1],p[2],'-',p[3],p[4],p[5],'-',p[6],p[7],p[8],p[9]].join('').replace(/-+$/,'');

export default class Input extends React.Component {
    static defaultProps = {
        type: 'text',
        disabled: false
    }

    handleChange = e => {
        let value = e.target.value;
        if (this.props.type === 'phone') {
            value = value.replace(/\D/g, '').substr(0, 10)
        }
        this.props.onChange && this.props.onChange(this.props.name, value, e);
    }

    handleFocus = e => this.props.onFocus && this.props.onFocus(e);

    handleClick = e => this.props.onClick && this.props.onClick(e);

    componentDidMount() {
        const { type, options, value, name } = this.props;
        if (type === 'select' && !options.find(o => o.value === value)) {
            this.props.onChange(name, options[0].value)
        }
    }

    render() {
        const { type, name, checked, value, options, disabled, placeholder } = this.props;
        let input = (
            <input
              ref="input"
              id={name}
              type={type.replace('phone', 'text')}
              checked={!!checked}
              className={type !== 'checkbox' && "form-control"}
              value={type === 'phone' ? formatPhone(value) : value}
              disabled={disabled}
              placeholder={placeholder}
              onClick={this.handleClick}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
            />
        );
        if (type === 'textarea') {
            input = (
                <textarea
                  ref="input"
                  id={name}
                  placeholder={placeholder}
                  className="form-control"
                  value={value}
                  disabled={disabled}
                  onClick={this.handleClick}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                />
            );
        } else if (type === 'select') {
            input = (
                <select
                  ref="input"
                  id={name}
                  className="form-control"
                  value={value}
                  onClick={this.handleClick}
                  onChange={this.handleChange}
                  onFocus={this.handleFocus}
                >
                    {options.map(({ value, label }) =>
                        <option key={value} value={value}>{label}</option>
                    )}
                </select>
            );
        } else if (type === 'phone') {
            input = (
                <span className={classes.phoneInput}>
                    <span>+1</span> {input}
                </span>
            );
        }
        return input;
    }
}
