import React from 'react';
import { Link } from 'react-router';

import Button from 'c/button';

import classes from './ManageHeader.css';

export default /* ManageHeader */ ({ title, entity, addRoute }) => (
    <h1 className={classes.manageHeader}>
        Manage {title}
        <Button to={addRoute} style="success">Add {entity}</Button>
    </h1>
);
