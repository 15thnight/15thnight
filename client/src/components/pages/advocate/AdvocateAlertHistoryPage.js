import React from 'react';
import { connect } from 'react-redux';

import { getAlerts } from 'api';
import { Alerts } from 'c/alert';


@connect(({ alerts }) => ({ alerts }), { getAlerts })
export default class AdvocateAlertHistoryPage extends React.Component {
    componentWillMount() {
        this.props.getAlerts();
    }

    render() {
        let { alerts } = this.props;
        return (
            <Alerts
              alerts={alerts}
              role='advocate'
              title='Previously Sent Alerts'
              description={''}
            />
        );
    }
}
