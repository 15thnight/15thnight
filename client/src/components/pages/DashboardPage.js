import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import AdminDashboard from 'components/admin';
import AdvocateDashboard from 'components/advocate';
import ProviderDashboard from 'components/provider';

export default class DashboardPage extends React.Component {

    componentWillMount() {
        if (!this.props.current_user) {
            this.props.router.push('/login');
        }
    }

    render() {
        let { current_user } = this.props;
        let { page, id } = this.props.params;
        let role = 'anonymous';
        if (current_user) {
            role = current_user.role;
        }
        switch (role) {
            case 'admin':    return (<AdminDashboard page={page} id={id} />);
            case 'advocate': return (<AdvocateDashboard page={page} />);
            case 'provider': return (<ProviderDashboard />);
            default: return null;
        }
    }
}

function mapStateToProps(state, ownProps) {
    return {
        current_user: state.current_user
    }
}

export default connect(mapStateToProps)(withRouter(DashboardPage));