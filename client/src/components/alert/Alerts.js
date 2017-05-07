import React from 'react';

import AlertList from './AlertList'
import AlertTable from './AlertTable';


export default /* Alerts */ ({ title, description, ...props }) => (
    <div>
        <h1 className="text-center">{title}</h1>
        <p className="text-center">{description}</p>
        <div className="hidden-xs"><AlertTable {...props} /></div>
        <div className="hidden-sm hidden-md hidden-lg"><AlertList {...props} /></div>
    </div>
);
