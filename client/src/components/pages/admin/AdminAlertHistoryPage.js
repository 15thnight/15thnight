import React from 'react';
import { connect } from 'react-redux';

import { getAlerts } from 'api';
import { Alerts } from 'alert';

class AdminAlertHistoryPage extends React.Component {

    componentWillMount() {
        this.props.getAlerts();
    }

    render() {
        let { alerts } = this.props;
        return (
            <Alerts
              alerts={alerts}
              role='admin'
              title='Alert History' />
        )
    }
}

function mapStateToProps(state) {
    return {
        alerts: state.alerts
    }
}

export default connect(mapStateToProps, {
    getAlerts
})(AdminAlertHistoryPage);