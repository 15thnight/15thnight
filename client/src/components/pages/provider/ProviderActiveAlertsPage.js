import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { getAlerts, setAlertRedirect } from 'actions';
import { Alerts } from 'alert';

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
            'This is a list of alerts created in '+
            'the last 2 days with unresolved needs or ' +
            'needs you haven\'t responded to.'
        );
        return (
            <Alerts
              alerts={alerts}
              role='provider'
              title='Active Alerts'
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
