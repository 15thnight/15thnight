import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { logoutUser } from 'actions';

class LogoutPage extends React.Component {

    componentWillMount() {
        if (this.props.current_user) {
            this.props.logoutUser();
        } else {
            this.props.router.push('/login');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.current_user) {
            this.props.router.push('/login');
        }
    }

    render() {
        return null;
    }
}

function mapStateToProps(state) {
    return {
        current_user: state.current_user
    }
}

export default connect(mapStateToProps, {
    logoutUser
})(withRouter(LogoutPage))
