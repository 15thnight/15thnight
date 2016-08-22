import React from 'react';
import { Link } from 'react-router';


export default class AlertTable extends React.Component {

    render() {
        let { role, alerts } = this.props;
        let respondColumnHeader = (<th>Responses</th>);
        if (role === 'provider') {
            respondColumnHeader = (<th>Respond</th>);
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
                            { respondColumnHeader }
                        </tr>
                    </thead>
                    <tbody>
                        { alerts.map((alert, key) => {
                            let needs = alert.needs.map(need => { return need.name }).join(', ');
                            let responseColumn = (<div>TODO</div>);
                            if (role === 'provider') {
                                responseColumn = (
                                    <Link
                                      to={"/respond-to/" + alert.id}
                                      className="btn btn-success">
                                        Respond
                                    </Link>
                                )
                            }
                            return (
                                <tr key={key}>
                                    { role === 'admin' && <td>{ alert.user.email }</td>}
                                    <td>{ alert.created_at }</td>
                                    <td>{ alert.description }</td>
                                    <td>{ alert.gender }</td>
                                    <td>{ alert.age }</td>
                                    <td>{ needs }</td>
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