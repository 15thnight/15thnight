import React from 'react';

import classes from './FormErrors.css';

const formatError = error => error
    .replace('of integer type', 'a number')
    .replace('min ', 'minimum ')
    .replace('max ', 'maximum ')


export default /* FormErrors */ ({ errors }) => (
    (!errors || errors.length === 0) ? null : (
        <div className={classes.formErrors}>
            {errors.map((error, key) => (
                <div key={key} className="error">{formatError(error)}</div>
            ))}
        </div>
    )
);
