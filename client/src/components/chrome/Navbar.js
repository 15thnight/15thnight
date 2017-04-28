import React from 'react';
import { Link } from 'react-router';

import NavbarLinks from './NavbarLinks';
import UserBar from './UserBar';

import styles from './Navbar.css';

export default class Navbar extends React.Component {

    componentWillReceiveProps(nextProps) {
        let { pathname } = this.props.routing.locationBeforeTransitions;
        if (pathname !== nextProps.routing.locationBeforeTransitions.pathname) {
            this.props.togglePageContainer(false);
            this.props.toggleNavbar(false);
        }
    }

    handleNavbarToggle(e) {
        let navbarOpen = !this.props.navbarOpen;
        this.props.toggleNavbar(navbarOpen);
        if (navbarOpen) {
            let scroll = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0);
            this.props.togglePageContainer(true, scroll || 0);
        } else {
            this.props.togglePageContainer(false);
        }

    }

    render() {
        let { current_user } = this.props;
        let { pathname } = this.props.routing.locationBeforeTransitions;
        let navbarCollapseClass = 'collapse navbar-collapse';
        if (this.props.navbarOpen) {
            navbarCollapseClass += ' in';
        }
        let navbarClass = "navbar navbar-default navbar-fixed-top " + styles.navbar;
        return(
            <nav className={"navbar navbar-default navbar-fixed-top " + styles.navbar}>
                <div className="container">
                    <div className="navbar-header">
                        <button
                          type="button"
                          className="navbar-toggle"
                          onClick={() => this.handleNavbarToggle()}
                        >
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link className="navbar-brand" to="/">
                            <b>15</b><sup>th</sup> <b>Night</b>
                        </Link>
                    </div>
                    <div className={navbarCollapseClass}>
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
