import React from 'react';

import FormGroup from './FormGroup';


export default class StaticField extends React.Component {
    render() {
        return (
            <FormGroup label={this.props.label + ":"}>
                <p className="form-control-static">
                    {this.props.children}
                </p>
            </FormGroup>
        )
    }
}