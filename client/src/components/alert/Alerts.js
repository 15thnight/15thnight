import React from 'react';

import AlertList from './AlertList'
import AlertTable from './AlertTable';


export default function Alerts(props) {
    return (
        <div>
            <h1 className="text-center">{props.title}</h1>
            <p className="text-center">{props.description}</p>
            <div className="hidden-xs">
                <AlertTable {...props} />
            </div>
            <div className="hidden-sm hidden-md hidden-lg">
                <AlertList {...props} />
            </div>
        </div>
    )
}