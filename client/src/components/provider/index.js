import React from 'react';
import { connect } from 'react-redux';

import { getAlerts } from 'actions';
import { AlertTable } from 'table';

class ProviderDashboard extends React.Component {

    componentWillMount() {
        this.props.getAlerts();
    }

    render() {
        let { alerts } = this.props;
        return (
            <AlertTable alerts={alerts}
                        role='provider'
                        title='Your Alerts'
                        description={'Here you can see alerts you have responded ' +
                                     'to and any alerts within the past 2 days ' +
                                     'that you have not responded to.'} />
        );
    }
}

function mapStateToProps(state) {
    return {
        alerts: state.alerts
    }
}

export default connect(mapStateToProps, {
    getAlerts
})(ProviderDashboard);