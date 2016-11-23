import React from 'react';
import { connect } from 'react-redux';

import { getAlerts } from 'actions';
import { Alerts } from 'alert';

class AdvocateAlertHistoryPage extends React.Component {

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
              description={''} />
        );
    }
}

function mapStateToProps(state) {
    return {
        alerts: state.alerts
    }
}

export default connect(mapStateToProps,{
    getAlerts
})(AdvocateAlertHistoryPage);