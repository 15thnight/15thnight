import React from 'react';
import { connect } from 'react-redux';

import { setAlertRedirect } from 'actions';
import { getAlerts } from 'api';
import { Alerts } from 'c/alert';


@connect(({ alerts }) => ({ alerts }), { getAlerts })
export default class ProviderActiveAlertsPage extends React.Component {
    componentWillMount() {
        this.props.getAlerts({ scope: 'all' });
    }

    render = () => (
        <Alerts
          alerts={this.props.alerts}
          role='provider'
          title='All Alerts'
          description="This is a list of all alerts you've been notified of"
        />
    );
}
