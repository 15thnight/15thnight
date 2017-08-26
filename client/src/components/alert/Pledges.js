import React from 'react';

import Timestamp from 'c/timestamp';
import { ContactInfo } from 'c/user';

import classes from './Pledges.css';


const PledgeRow = ({ label, children }) => (
    <div className="row">
        <label className="col-sm-3 text-right">{label}:</label>
        <div className="col-sm-9 text-left">{children}</div>
    </div>
);

export const Pledge = ({ pledge: { provider, created_at, message } }) => (
    <div className={classes.pledge}>
        <PledgeRow label="From">
            <div>{provider.name}</div>
            <ContactInfo email={provider.email} phone_number={provider.phone_number} />
            <div>{provider.organization}</div>
        </PledgeRow>
        <PledgeRow label="Sent">
            <Timestamp time={created_at} />
        </PledgeRow>
        <PledgeRow label="Message">{message}</PledgeRow>
    </div>
)

export const Pledges = ({ pledges }) => (
    <div>{pledges.map(pledge => <Pledge key={pledge.id} pledge={pledge} />)}</div>
);
