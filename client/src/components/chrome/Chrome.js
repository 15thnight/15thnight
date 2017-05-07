import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Notifications, { success as successFlash } from 'react-notification-system-redux';

import { togglePageContainer, clearPageScroll } from 'actions';
import Navbar from './Navbar';
import Flash from './Flash';

import classes from './Chrome.css';


@connect(
    ({ pageContainer, current_user, routing, notifications }) =>
        ({ pageContainer, current_user, routing, notifications }),
    { togglePageContainer, clearPageScroll, successFlash }
)
export default class Chrome extends React.Component {
    state = {
        navbarOpen: false
    }

    componentWillMount() {
        const { body } = document;
        body.parentElement.style.height = body.style.height = '100%';
        window.addEventListener('resize', this.handleWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowResize);
    }

    componentDidUpdate() {
        const { pageContainer: { hidden, scroll } } = this.props;
        if (!hidden && scroll) {
            window.scrollTo(0, scroll);
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
        const {
            current_user,
            notifications,
            routing,
            children,
            pageContainer: { hidden }
        } = this.props;
        return (
            <div className={cx(classes.chrome, {'hide-page': hidden})}>
                {current_user &&
                    <Navbar
                      navbarOpen={this.state.navbarOpen}
                      toggleNavbar={navbarOpen => this.setState({ navbarOpen })}
                      current_user={current_user}
                      routing={routing}
                      togglePageContainer={this.props.togglePageContainer}
                    />
                }
                <div className={cx("container-fluid container", {anonymous: !current_user})}>
                    {children}
                </div>
                <Notifications notifications={notifications} />
                <Flash />
            </div>
        );
    }
}
