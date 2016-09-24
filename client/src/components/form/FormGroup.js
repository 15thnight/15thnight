import React from 'react';


function FormGroup(props) {
    let { label, children, htmlFor, className, id } = props;
    let classes = 'form-group';
    if (className) {
        classes = classes + ' ' + className;
    }
    return (
        <div className={classes} id={id}>
            <label htmlFor={htmlFor} className="col-lg-4 col-md-2 col-sm-2 control-label">
                {label}
            </label>
            <div className="col-lg-8 col-md-10 col-sm-10 text-left">
                {children}
            </div>
        </div>
    )
}

export default FormGroup;