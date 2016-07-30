import React from 'react';


export default class FormErrors extends React.Component {
    render() {
        let { errors } = this.props;
        if (!errors || errors.length === 0) {
            return null;
        }
        return (
            <div>
                {errors.map((error, key) => {
                    return (
                        <div key={key} className="error">{error}</div>
                    );
                })}
            </div>
        );
    }
}