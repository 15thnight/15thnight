import React from 'react';

import classes from './Loading.css';

export default /* Loading */ ({ title }) => (
    <div className={classes.loading}>
        <h1 className="text-center">Loading {title}...</h1>
    </div>
)
