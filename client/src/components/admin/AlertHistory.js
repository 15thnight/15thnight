import React from 'react';
import { connect } from 'react-redux';

import { getAlerts } from 'actions';
import { AlertTable } from 'table'

class AlertHistory extends React.Component {

    componentWillMount() {
        this.props.getAlerts();
    }

    render() {
        let { alerts } = this.props;
        return (
            <AlertTable
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
})(AlertHistory);