import React from 'react';

import styles from './FormErrors.css';


export default class FormErrors extends React.Component {
    render() {
        let { errors } = this.props;
        if (!errors || errors.length === 0) {
            return null;
        }
        return (
            <div className={styles.formErrors}>
                {errors.map((error, key) => (
                    <div key={key} className="error">{error}</div>
                ))}
            </div>
        );
    }
}