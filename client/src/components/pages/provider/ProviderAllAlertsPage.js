import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getAlerts, setAlertRedirect } from 'actions';
import { AlertTable } from 'table';

class ProviderActiveAlertsPage extends React.Component {

    componentWillMount() {
        this.props.getAlerts('all');
    }

    render() {
        let { alerts } = this.props;
        const description = (
            'This is a list of all alerts you\'ve been ' +
            'notified of.'
        );
        return (
            <AlertTable
              alerts={alerts}
              role='provider'
              title='All Alerts'
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
