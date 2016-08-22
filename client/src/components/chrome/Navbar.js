import React from 'react';
import { Link } from 'react-router';

import styles from './Navbar.css';


export default class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accountDropdownOpen: false,
            manageDropdownOpen: false
        }
    }

    componentDidMount() {
        document.body.addEventListener('click', this.handleBodyClick.bind(this));
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.handleBodyClick.bind(this));
    }


    handleBodyClick(e) {
        if (!this.state.accountDropdownOpen && !this.state.manageDropdownOpen) {
            return;
        }
        let element = e.target;
        while (element.tagName !== 'HTML') {
            if (element.className === 'dropdown-toggle') {
                return
            }
            element = element.parentNode;
        }
        this.setState({ accountDropdownOpen: false, manageDropdownOpen: false });
    }

    handleDropdownToggleClick(menu, e) {
        e.preventDefault();
        let state = { accountDropdownOpen: false, manageDropdownOpen: false };
        if (menu === 'account') {
            state.accountDropdownOpen = !this.state.accountDropdownOpen;
        } else if (menu === 'manage') {
            state.manageDropdownOpen = !this.state.manageDropdownOpen;
        }
        this.setState(state);
    }

    render() {
        let { current_user } = this.props;
        let user_menu = (<li><Link to="/login">Login</Link></li>);
        if (current_user) {
            user_menu = [];
            let accountDropdownClass = 'dropdown';
            if (this.state.accountDropdownOpen) {
                accountDropdownClass += ' open';
            }
            switch(current_user.role) {
                case 'provider':
                    user_menu.push(
                        <li key='active-alerts'><Link to='/active-alerts'>Active Alerts</Link></li>
                    );
                    break;
                case 'advocate':
                    user_menu.push(
                        <li key='send-alert'><Link to='/send-alert'>Send an Alert</Link></li>,
                        <li key='alert-history'><Link to='/alert-history'>Alert History</Link></li>
                    );
                    break;
                case 'admin':
                    let manageDropdownClass = 'dropdown';
                    if (this.state.manageDropdownOpen) {
                        manageDropdownClass += ' open';
                    }
                    user_menu.push(
                        <li key='alert-history'><Link to='/alert-history'>Alert History</Link></li>,
                        <li key='manage-dropdown' className={manageDropdownClass}>
                            <a href="#" className="dropdown-toggle" onClick={this.handleDropdownToggleClick.bind(this, 'manage')}>
                                Manage
                                <span className="caret"></span>
                            </a>
                            <ul className="dropdown-menu">
                                <li><Link to="/manage-users">Users</Link></li>
                                <li><Link to="/manage-categories">Categories</Link></li>
                                <li><Link to="/manage-services">Services</Link></li>
                            </ul>
                        </li>
                    );
                    break;
            }
            user_menu.push(
                <li key='account-dropdown' className={accountDropdownClass}>
                    <a href="#" className="dropdown-toggle" onClick={this.handleDropdownToggleClick.bind(this, 'account')}>
                        Account
                        <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu">
                        <li><Link to="/edit-profile">Edit Profile</Link></li>
                        <li><Link to="/change-password">Change Password</Link></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="/logout">Logout</a></li>
                    </ul>
                </li>
            );
        }
        return(
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <Link className="navbar-brand" to="/">
                            <b>15</b><sup>th</sup> <b>Night</b>
                        </Link>
                    </div>
                    <div className="collapse navbar-collapse" id="navbar">
                        <ul className="nav navbar-nav navbar-right">
                            { user_menu }
                        </ul>
                    </div>
                </div>
                {
                    current_user &&
                    <div className={styles.userBar}>
                        <div className={styles.userBarContainer + ' container'}>
                            Logged in as <strong>{ current_user.email }</strong>
                        </div>
                    </div>
                }
            </nav>
        );
    }
}