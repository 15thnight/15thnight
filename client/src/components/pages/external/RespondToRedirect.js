import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { setAlertRedirect } from 'actions';

class RespondToRedirect extends React.Component {

    componentWillMount() {
        this.props.setAlertRedirect(this.props.params.alertId);
        this.props.router.push('/');
    }

    render() {
        return null;
    }
}

function mapStateToProps() {
    return {}
}

export default connect(mapStateToProps, {
    setAlertRedirect
})(withRouter(RespondToRedirect));