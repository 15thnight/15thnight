import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { setAlertRedirect } from 'actions';
import { getAlerts } from 'api';
import { Alerts } from 'c/alert';


@withRouter
@connect(({ alerts }) => ({ alerts }), { getAlerts, setAlertRedirect })
export default class ProviderActiveAlertsPage extends React.Component {
    componentWillMount() {
        this.props.getAlerts({ scope: 'responded' });
    }

    render = () => (
        <Alerts
          alerts={this.props.alerts}
          role='provider'
          title='Alerts Responded'
          description='This is a list of alerts you have responded to.'
        />
    );
}
