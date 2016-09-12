import React from 'react';

import FormErrors from './FormErrors';
import FormGroup from './FormGroup';
import Input from './Input';

class InputField extends React.Component {
    constructor(props) {
        super(props);
        this.defaultProps = {
            errors: []
        }
    }

    render() {
        let { label, errors } = this.props;
        label += ':';
        return (
            <FormGroup htmlFor={name} label={label}>
                <Input {...this.props} />
                <FormErrors errors={errors} />
                {this.props.children}
            </FormGroup>
        )
    }
}

//InputField.defaultProps = {

//}

export default InputField;