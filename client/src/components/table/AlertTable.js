import React from 'react';
import { Link } from 'react-router';


export default class AlertTable extends React.Component {

    render() {
        let { role, alerts } = this.props;
        let headerColumns = [];
        if (role === 'provider') {
            headerColumns.push(
                <th key="response-count"># of times you<br/>have responded</th>,
                <th key="respond">Respond</th>
            );
        } else { // advocates, admins
            headerColumns.push(<th key="responses">Responses</th>)
        }
        if (role === 'advocate') {
            headerColumns.push(
                <th key="resolved">% Resolved</th>,
                <th key="view"/>
            );
        }
        return (
            <div>
                <h1 className="text-center">{this.props.title}</h1>
                <p className="text-center">{this.props.description}</p>
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
                            let needs = alert.needs.map(need => {
                                let name = need.service.name;
                                return (
                                    <div>
                                        {
                                            need.resolved ?
                                            <del>{name}</del> :
                                            <span>{name}</span>
                                        }
                                        {
                                            (role === 'provider' &&
                                            need.provisions.length > 0) &&
                                            <span> (responded to {need.provisions.length} time{need.provisions.length > 1 && 's'})</span>
                                        }
                                    </div>
                                );
                            });
                            let columns = [];
                            if (role === 'advocate') {
                                let totalResolved = alert.needs.reduce((total, need) => { return need.resolved ? total + 1 : total }, 0);
                                columns.push(
                                    <td key="responses">
                                        { alert.responses.length }
                                    </td>,
                                    <td key="resolved">
                                        { Math.floor((totalResolved / alert.needs.length) * 100)}%
                                    </td>
                                )
                            }
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
                                columns.push(
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
                                    <td>{ needs }</td>
                                    { columns }
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}