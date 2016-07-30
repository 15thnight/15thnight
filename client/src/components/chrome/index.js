import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';

import Navbar from './Navbar';
import Flash from './Flash';

class Chrome extends React.Component {

    render() {
        let { current_user } = this.props;
        return (
            <div>
                <Navbar current_user={current_user} />
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
        current_user: state.current_user
    }
}

export default connect(mapStateToProps)(withRouter(Chrome));