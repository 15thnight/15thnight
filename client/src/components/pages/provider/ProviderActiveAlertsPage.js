import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getAlerts, setAlertRedirect } from 'actions';
import { AlertTable } from 'table';

class ProviderActiveAlertsPage extends React.Component {

    componentWillMount() {
        if (this.props.alertRedirect) {
            this.props.setAlertRedirect(null);
            return this.props.router.push('/respond-to/' + this.props.alertRedirect);
        }
        this.props.getAlerts();
    }

    render() {
        let { alerts } = this.props;
        const description = (
            'Here you can see alerts you have responded ' +
            'to and any alerts within the past 2 days ' +
            'that you have not responded to.'
        );
        return (
            <AlertTable
              alerts={alerts}
              role='provider'
              title='Your Alerts'
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
