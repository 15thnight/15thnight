import React from 'react';


function AlertInfo(props) {
    let { alert } = props;
    let needs = alert.needs.map(need => need.service.name).join(', ');
    return (
        <div>
            <h3>Sent at: { alert.created_at }</h3>
            <h3>Age: { alert.age }</h3>
            <h3>Gender: { alert.gender }</h3>
            <h3>Needs: { needs }</h3>
            <h3>Message: { alert.description }</h3>
        </div>
    );
}

export default AlertInfo;