import React from 'react';

import FormGroup from './FormGroup';

import classes from './StaticField.css';


export default /* StaticField */ ({ children, ...props }) => (
    <FormGroup className={classes.staticField} {...props}>
        <div className="form-control-static">{children}</div>
    </FormGroup>
)
