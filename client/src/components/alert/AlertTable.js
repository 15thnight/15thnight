import React from 'react';
import { Link } from 'react-router';

import Needs from './Needs';


export default function AlertTable(props) {
    let { role, alerts } = props;
    let headerColumns = [];
    if (role === 'provider') {
        headerColumns.push(
            <th key="response-count"># of times you<br/>have responded</th>,
            <th key="respond">Respond</th>
        );
    } else { // advocates, admins
        headerColumns.push(
            <th key="responses">Responses</th>,
            <th key="resolved">% Resolved</th>,
            <th key="view"/>
        );
    }
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Sent By</th>
                        <th>Sent At</th>
                        <th>Description</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Needs</th>
                        { headerColumns }
                    </tr>
                </thead>
                <tbody>
                    { alerts.map(alert => {
                        let columns = [];
                        if (role === 'provider') {
                            columns.push(
                                <td key="response-count">
                                    {alert.responses.length}
                                </td>,
                                <td key="respond-to">
                                    <Link
                                      to={"/respond-to/" + alert.id}
                                      className="btn btn-success">
                                        Respond
                                    </Link>
                                </td>
                            );
                        } else { // advocates, admins
                            let totalResolved = alert.needs.reduce((total, need) => need.resolved ? total + 1 : total, 0);
                            columns.push(
                                <td key="responses">
                                    { alert.responses.length }
                                </td>,
                                <td key="resolved">
                                    { Math.floor((totalResolved / alert.needs.length) * 100)}%
                                </td>,
                                <td key="view-responses">
                                    <Link
                                      to={'/view-responses/' + alert.id}
                                      className="btn btn-primary">
                                        View Responses
                                    </Link>
                                </td>
                            );
                        }
                        return (
                            <tr key={alert.id}>
                                <td>
                                    { alert.user.name } <br/>
                                    { alert.user.organization }<br/>
                                    { alert.user.email } &middot; { alert.user.phone_number }
                                </td>
                                <td>{ alert.created_at }</td>
                                <td>{ alert.description }</td>
                                <td>{ alert.gender }</td>
                                <td>{ alert.age }</td>
                                <td><Needs needs={ alert.needs}  role={ role }/></td>
                                { columns }
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}