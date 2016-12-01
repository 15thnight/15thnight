import React from 'react';
import { Link } from 'react-router';

import { FormGroup } from 'form';
import Needs from './Needs';

import styles from './AlertList.css';


function Alert(props) {
    let { alert, role } = props;
    let gender = alert.gender === 'unspecified' ? '' : alert.gender;
    let button = (
        <Link
          to={"/respond-to/" + alert.id}
          className="btn btn-success">
            Respond
        </Link>
    );
    let status = (
        <FormGroup label="Status:">
            <div>You have responded to this { alert.responses.length } times</div>
        </FormGroup>
    );
    if (role !== 'provider') {
        let totalResolved = alert.needs.reduce((total, need) => need.resolved ? total + 1 : total, 0);
        let percentResolved = Math.floor((totalResolved / alert.needs.length) * 100);
        status = (
            <FormGroup label="Status:">
                <div>
                    { alert.responses.length } Responses,&nbsp;
                    { percentResolved }% Resolved
                </div>
            </FormGroup>
        );
        button = (
            <Link
              to={'/view-responses/' + alert.id}
              className="btn btn-primary">
                View Responses
            </Link>
        );
    }
    return (
        <div className={"form-horizontal " + styles.alert}>
            <FormGroup label="Sent By:">
                { alert.user.name } <br/>
                { alert.user.organization }<br/>
                { alert.user.email } &middot; { alert.user.phone_number }
            </FormGroup>
            <FormGroup label="Description:">
                Sent at { alert.created_at } <br/>
                { alert.age } year old { gender }<br/>
                { alert.description }
            </FormGroup>
            <FormGroup label="Needs:">
                <Needs needs={ alert.needs } role={role} />
            </FormGroup>
            { status }
            <div className="text-center">
                { button }
            </div>
        </div>
    );
}

export default function AlertList(props) {
    let { role, alerts } = props;
    return (
        <div>
            { alerts.map(alert => <Alert key={alert.id} alert={alert} role={role} />) }
        </div>

    );
}