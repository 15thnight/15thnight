import React from 'react';
import { Link } from 'react-router';


export default class AlertTable extends React.Component {

    render() {
        let { role, alerts } = this.props;
        let respondHeaderColumn = (<th>Responses</th>);
        if (role === 'provider') {
            respondHeaderColumn = (<th>Respond</th>);
        }
        let advocateHeaderColumns;
        if (role === 'advocate') {
            advocateHeaderColumns = [<th key="resolved">% Resolved</th>, <th key="view"/>];
        }
        return (
            <div>
                <h1 className="text-center">{this.props.title}</h1>
                <p className="text-center">{this.props.description}</p>
                <table className="table">
                    <thead>
                        <tr>
                            { role === 'admin' && <th>Advocate</th> }
                            <th>Sent At</th>
                            <th>Description</th>
                            <th>Gender</th>
                            <th>Age</th>
                            <th>Needs</th>
                            { respondHeaderColumn }
                            { advocateHeaderColumns }
                        </tr>
                    </thead>
                    <tbody>
                        { alerts.map(alert => {
                            let needs = alert.needs.map(need => {
                                let name = need.service.name;
                                return (
                                    <div>
                                        {need.resolved ? <del>{name}</del> : <span>{name}</span>}
                                    </div>
                                );
                            });
                            let responseColumn = (<div>TODO</div>);
                            if (role === 'provider') {
                                responseColumn = (
                                    <Link
                                      to={"/respond-to/" + alert.id}
                                      className="btn btn-success">
                                        Respond
                                    </Link>
                                );
                            } else if (role === 'advocate') {
                                responseColumn = (
                                    <Link
                                      to={'/view-responses/' + alert.id}
                                      className="btn btn-primary">
                                        View Responses
                                    </Link>
                                );
                            }
                            let totalResolved = alert.needs.reduce((total, need) => { return need.resolved ? total + 1 : total }, 0);
                            let advocateColumns;
                            if (role === 'advocate') {
                                advocateColumns = [
                                    <td key="responses">{ alert.responses.length }</td>,
                                    <td key="resolved">{ Math.floor((totalResolved / alert.needs.length) * 100)}%</td>
                                ]
                            }
                            return (
                                <tr key={alert.id}>
                                    { role === 'admin' && <td>{ alert.user.email }</td>}
                                    <td>{ alert.created_at }</td>
                                    <td>{ alert.description }</td>
                                    <td>{ alert.gender }</td>
                                    <td>{ alert.age }</td>
                                    <td>{ needs }</td>
                                    { advocateColumns }
                                    <td>{ responseColumn }</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}