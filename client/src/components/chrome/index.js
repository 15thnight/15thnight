import React from 'react';
import { connect } from 'react-redux';

import { getCurrentUser } from 'actions';
import Navbar from './Navbar.js';
import Flash from './Flash';

class Chrome extends React.Component {

    componentWillMount() {
        this.props.getCurrentUser();
    }

    render() {
        let { current_user, routing } = this.props;
        return (
            <div>
                <Navbar current_user={current_user} routing={routing} />
                <div className="container-fluid">
                    <Flash />
                    { this.props.children }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        current_user: state.current_user,
        routing: state.routing
    }
}

export default connect(mapStateToProps, {
    getCurrentUser
})(Chrome);