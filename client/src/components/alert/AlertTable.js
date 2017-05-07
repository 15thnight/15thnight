import React from 'react';
import { Link } from 'react-router';

import Timestamp from 'c/timestamp';
import Button from 'c/button';
import Table from 'c/table';
import AlertAdvocate from './AlertAdvocate';
import Needs from './Needs';


export default /* AlertTable */ ({ role, alerts }) => (
    <Table>
        <Table.Header>
            {role !== 'advocate' && <th>Sent By</th>}
            <th>Sent</th>
            <th>Description</th>
            <th>Age/Gender</th>
            <th>Needs</th>
            {role === 'provider' && <th key="respond">Respond</th>}
            {role !== 'provider' && <th key="responses">Responses</th>}
        </Table.Header>
        {alerts.map(({ id, responses, totalResolved, needs, user, created_at, description, gender, age }) => (
            <Table.Row key={id}>
                {role !== 'advocate' && <td><AlertAdvocate advocate={user} /></td>}
                <td><Timestamp fromNow time={created_at} multiLine /></td>
                <td>{description}</td>
                <td>{age} {gender}</td>
                <td><Needs needs={needs} role={role} /></td>
                {role === 'provider' &&
                    <td key="respond">
                        You've responded <strong>{responses} time{responses !== 1 && 's'}</strong><br/>
                        <Button to={`/respond-to/${id}`} style="success">Respond</Button>
                    </td>
                }
                {role !== 'provider' &&
                    <td key="responses">
                        <strong>Responses:</strong> {responses}<br/>
                        <div>
                            <strong>Resolved: </strong>
                            {Math.floor((totalResolved / needs.length) * 100)}% ({totalResolved}/{needs.length})
                        </div>
                        <Button to={`/view/${id}`}>View Responses</Button>
                    </td>
                }
            </Table.Row>
        ))}
    </Table>
);
