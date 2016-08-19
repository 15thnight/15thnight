import React from 'react';
import { connect } from 'react-redux';

import { AlertTable } from 'table';
import { getAlerts } from 'actions';

class AdvocateAlertHistoryPage extends React.Component {

    componentWillMount() {
        this.props.getAlerts();
    }

    render() {
        let { alerts } = this.props;
        return (
            <AlertTable 
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