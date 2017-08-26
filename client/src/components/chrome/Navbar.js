import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';

import NavbarLinks from './NavbarLinks';
import UserBar from './UserBar';

import classes from './Navbar.css';

export default class Navbar extends React.Component {

    componentWillReceiveProps(nextProps) {
        const { pathname } = this.props.routing.locationBeforeTransitions;
        if (pathname !== nextProps.routing.locationBeforeTransitions.pathname) {
            this.props.togglePageContainer(false);
            this.props.toggleNavbar(false);
        }
    }

    handleNavbarToggle = e => {
        const navbarOpen = !this.props.navbarOpen;
        this.props.toggleNavbar(navbarOpen);
        if (navbarOpen) {
            const scroll = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0);
            this.props.togglePageContainer(true, scroll || 0);
        } else {
            this.props.togglePageContainer(false);
        }

    }

    render() {
        const { current_user, navbarOpen } = this.props;
        const { pathname } = this.props.routing.locationBeforeTransitions;
        return (
            <nav className={cx('navbar navbar-default navbar-fixed-top', classes.navbar)}>
                <div className="container">
                    <div className="navbar-header">
                        <button
                          type="button"
                          className="navbar-toggle"
                          onClick={this.handleNavbarToggle}
                        >
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <Link className="navbar-brand" to="/">
                            <b>15</b><sup>th</sup> <b>Night</b>
                        </Link>
                    </div>
                    <div className={cx('collapse navbar-collapse', { in: navbarOpen })}>
                        <NavbarLinks
                          current_user={current_user}
                          pathname={pathname}
                        />
                    </div>
                </div>
                {current_user &&
                    <UserBar current_user={current_user} />
                }
            </nav>
        );
    }
}
