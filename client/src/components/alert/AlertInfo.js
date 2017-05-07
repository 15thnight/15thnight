import React from 'react';
import cx from 'classnames';

import Timestamp from 'c/timestamp';
import { StaticField } from 'c/form';
import Needs from './Needs';
import classes from './AlertInfo.css';


export default /* AlertInfo */ ({ alert: { needs, created_at, age, gender, description } }) => (
    <div className={cx(classes.alertInfo, 'form-horizontal')}>
        <StaticField xs label="Needs"><Needs needs={needs} withLink /></StaticField>
        <StaticField xs label="Sent"><Timestamp time={created_at} multiLine /></StaticField>
        <StaticField xs label="Age">{age}</StaticField>
        <StaticField xs label="Gender">{gender}</StaticField>
        <StaticField xs label="Message">{description}</StaticField>
    </div>
);
