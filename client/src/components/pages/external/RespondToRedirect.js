import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { setAlertRedirect } from 'actions';

@withRouter
@connect(null, { setAlertRedirect })
export default class RespondToRedirect extends React.Component {
    componentWillMount() {
        this.props.setAlertRedirect(this.props.params.alertId);
        this.props.router.push('/');
    }

    render() {
        return null;
    }
}
