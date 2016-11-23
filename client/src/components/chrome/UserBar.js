import React from 'react';

import styles from './UserBar.css';


export default function UserBar(props) {
    let { current_user } = props;
    return (
        <div className={styles.userBar}>
            <div className="container">
                Logged in as <strong>{ current_user.email }</strong>
            </div>
        </div>
    )
}