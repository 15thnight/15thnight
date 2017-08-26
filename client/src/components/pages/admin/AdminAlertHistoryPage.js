import React from 'react';
import { connect } from 'react-redux';

import { getAlerts } from 'api';
import { Alerts } from 'c/alert';

@connect(({ alerts }) => ({ alerts }), { getAlerts })
export default class AdminAlertHistoryPage extends React.Component {
    componentWillMount() {
        this.props.getAlerts();
    }

    render = () => (
        <Alerts
          alerts={this.props.alerts}
          role='admin'
          title='Alert History'
        />
    )
}
