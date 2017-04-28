import React from 'react';
import { connect } from 'react-redux';

import { togglePageContainer, clearPageScroll } from 'actions';
import { getCurrentUser } from 'api';

import Navbar from './Navbar.js';
import Flash from './Flash';

import styles from './index.css';

class Chrome extends React.Component {

    state = {
        navbarOpen: false
    }

    componentWillMount() {
        let { body } = document;
        body.parentElement.style.height = body.style.height = '100%';
        this.props.getCurrentUser();
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    componentDidUpdate() {
        const { pageContainer } = this.props;
        if (!pageContainer.hidden && pageContainer.scroll) {
            window.scrollTo(0, pageContainer.scroll);
            this.props.clearPageScroll();
        }
        window.removeEventListener('resize', this.handleWindowResize);
    }

    handleWindowResize = () => {
        if (window.innerWidth >= 768 && this.props.pageContainer.hidden) {
            if (this.props.pageContainer.scroll) {
                window.scrollTo(0, this.props.pageContainer.scroll);
            }
            this.props.togglePageContainer(false);
            this.setState({ navbarOpen: false });
        }
    }

    render() {
        let { current_user, routing } = this.props;
        let className = styles.chrome;
        if (this.props.pageContainer.hidden) {
            className = className += ' hide-page';
        }
        return (
            <div className={className}>
                <Navbar
                  navbarOpen={this.state.navbarOpen}
                  toggleNavbar={(navbarOpen) => this.setState({ navbarOpen })}
                  current_user={current_user}
                  routing={routing}
                  togglePageContainer={this.props.togglePageContainer}
                />
                <div className="container-fluid container">
                    <Flash />
                    { this.props.children }
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        pageContainer: state.pageContainer,
        current_user: state.current_user,
        routing: state.routing
    }
}

export default connect(mapStateToProps, {
    getCurrentUser,
    togglePageContainer,
    clearPageScroll
})(Chrome);
