import React from 'react';


export default class FormGroup extends React.Component {
    render() {
        let { label, children, htmlFor } = this.props;
        return (
            <div className="form-group">
                <label htmlFor={htmlFor} className="col-lg-4 col-md-2 col-sm-2 control-label">
                    {label}
                </label>
                <div className="col-lg-8 col-md-10 col-sm-10 text-left">
                    {children}
                </div>
            </div>
        )
    }
}