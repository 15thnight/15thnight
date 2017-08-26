import React from 'react';
import cx from 'classnames';

import Button from 'c/button';
import { FormGroup } from 'c/form';
import Timestamp from 'c/timestamp';
import AlertAdvocate from './AlertAdvocate';
import Needs from './Needs';

import classes from './AlertList.css';


export default /* AlertList */ ({ role, alerts }) => (
    <div>
        {alerts.map(({ id, created_at, user, age, gender, description, needs, totalResolved, responses }) => (
            <div key={id} className={cx('form-horizontal', classes.alert)}>
                <FormGroup label="Sent By" xs>
                    <AlertAdvocate advocate={user} />
                </FormGroup>
                <FormGroup label="Sent At" xs>
                    <Timestamp time={created_at} />
                </FormGroup>
                <FormGroup label="Age/Gender" xs>
                    {age} year old {gender || 'unspecified gender'}
                </FormGroup>
                <FormGroup label="Description" xs>{description}</FormGroup>
                <FormGroup label="Needs" xs>
                    <Needs needs={needs} role={role} />
                </FormGroup>
                {role === 'provider' &&
                    <FormGroup label="Status" xs>
                        You have responded to this {responses.length} times
                    </FormGroup>
                }
                {role !== 'provider' &&
                    <FormGroup label="Status" xs>
                        <div>{responses.length} Responses</div>
                        <div>{Math.floor((totalResolved / needs.length) * 100)}% Resolved</div>
                    </FormGroup>
                }
                <br/>
                <div className="text-center">
                    {role === 'provider' &&
                        <Button to={`/respond-to/${id}`} style="success">Respond</Button>
                    }
                    {role !== 'provider' &&
                        <Button to={`/view/${id}`}>View Responses</Button>
                    }
                </div>
            </div>
        ))}
    </div>
);
