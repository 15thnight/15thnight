import React from 'react';

import FormErrors from './FormErrors';
import FormGroup from './FormGroup';
import Input from './Input';

export default /* InputField */ ({ label, errors=[], children, xs, sizes, ...props }) => (
    <FormGroup htmlFor={name} label={label} xs={xs} sizes={sizes}>
        <Input {...props} />
        <FormErrors errors={errors} />
        {children}
    </FormGroup>
)
