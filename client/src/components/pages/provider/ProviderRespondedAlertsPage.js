import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getAlerts, setAlertRedirect } from 'actions';
import { Alerts } from 'alert';

class ProviderActiveAlertsPage extends React.Component {

    componentWillMount() {
        this.props.getAlerts('responded');
    }

    render() {
        let { alerts } = this.props;
        const description = (
            'This is a list of alerts you have responded to.'
        );
        return (
            <Alerts
              alerts={alerts}
              role='provider'
              title='Alerts Responded'
              description={description} />
        );
    }
}

function mapStateToProps(state) {
    return {
        alerts: state.alerts,
        alertRedirect: state.alertRedirect
    }
}

export default connect(mapStateToProps, {
    getAlerts,
    setAlertRedirect
})(withRouter(ProviderActiveAlertsPage));
