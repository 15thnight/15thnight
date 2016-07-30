import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import AlertTable from 'table/AlertTable';
import AlertForm from './AlertForm';
import { getAlerts } from 'actions';

class AdvocateDashboard extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.props.getAlerts();
    }

    render() {
        let { alerts, page } = this.props;
        if (page === 'previous-alerts') {
            return (
                <div>
                    <div className="text-right">
                        <Link to='/dashboard' className="btn btn-primary">Send a new Alert</Link>
                    </div>
                    <AlertTable alerts={alerts}
                                role='advocate'
                                title='Previously Sent Alerts'
                                description={''} />
                </div>
            );
        }
        return (
            <div id="new_alert">
                <div className="text-right">
                    <Link to='/dashboard/previous-alerts' className="btn btn-primary">Previously Sent Alerts</Link>
                </div>
                <AlertForm />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        alerts: state.alerts
    }
}

export default connect(mapStateToProps,{
    getAlerts
})(AdvocateDashboard);