import React from 'react';

import Button from 'c/button';
import Form from './Form';

export default /* DeleteConfirmForm */ ({ title, onCancel, onConfirm, children }) => (
    <Form>
        <h1>Delete {title}</h1>
        <div>Are you sure you wish to delete this {title}?</div>
        <br/>
        {children}
        <div className="text-left">
            <Button onClick={onCancel}>Cancel</Button>
            <Button className="pull-right" style="danger" onClick={onConfirm}>Delete {title}</Button>
        </div>
    </Form>
)
