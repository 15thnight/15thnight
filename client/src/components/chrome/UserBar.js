import React from 'react';

import classes from './UserBar.css';


export default /* UserBar */ ({ current_user: { email } }) => (
    <div className={classes.userBar}>
        <div className="container">
            Logged in as <strong>{email}</strong>
        </div>
    </div>
);
