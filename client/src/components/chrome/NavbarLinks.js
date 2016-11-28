import React from 'react';
import { Link } from 'react-router';

import DropdownMenu from './DropdownMenu';


export default class NavbarLinks extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            accountDropdownOpen: false,
            manageDropdownOpen: false,
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
            if (element.className.indexOf('dropdown-toggle') >= 0) {
                return
            }
            element = element.parentNode;
        }
        this.setState({ accountDropdownOpen: false, manageDropdownOpen: false });
    }

    handleDropdownToggleClick(menu) {
        let state = { accountDropdownOpen: false, manageDropdownOpen: false };
        if (menu === 'account') {
            state.accountDropdownOpen = !this.state.accountDropdownOpen;
        } else if (menu === 'manage') {
            state.manageDropdownOpen = !this.state.manageDropdownOpen;
        }
        this.setState(state);
    }


    render() {
        let { current_user, pathname } = this.props;
        let user_menu = (
            <li>
                <Link to="/login">Login</Link>
            </li>
        );
        if (current_user) {
            user_menu = [];
            switch(current_user.role) {
                case 'provider':
                    if (pathname === '/') {
                        pathname = '/active-alerts'
                    }
                    user_menu.push(
                        <li className={pathname === '/active-alerts' && 'active'} key='active-alerts'>
                            <Link to='/active-alerts'>Active Alerts</Link>
                        </li>,
                        <li className={pathname === '/responded-alerts' && 'active'} key='responded-alerts'>
                            <Link to='/responded-alerts'>Responded Alerts</Link>
                        </li>,
                        <li className={pathname === '/all-alerts' && 'active'} key='all-alerts'>
                            <Link to='/all-alerts'>All Alerts</Link>
                        </li>
                    );
                    break;
                case 'advocate':
                    if (pathname === '/') {
                        pathname = '/send-alert';
                    }
                    user_menu.push(
                        <li className={pathname === '/send-alert' && 'active'} key='send-alert'>
                            <Link to='/send-alert'>Send an Alert</Link>
                        </li>,
                        <li className={pathname === '/alert-history' && 'active'} key='alert-history'>
                            <Link to='/alert-history'>Alert History</Link>
                        </li>
                    );
                    break;
                case 'admin':
                    user_menu.push(
                        <li key='alert-history'>
                            <Link to='/alert-history'>Alert History</Link>
                        </li>,
                        <DropdownMenu
                          key='manage-dropdown'
                          label="Manage"
                          isOpen={this.state.manageDropdownOpen}
                          onClick={() => this.handleDropdownToggleClick('manage')}>
                            <li>
                                <Link to="/manage-users">Users</Link>
                            </li>
                            <li>
                                <Link to="/manage-categories">Categories</Link>
                            </li>
                            <li>
                                <Link to="/manage-services">Services</Link>
                            </li>
                        </DropdownMenu>
                    );
                    break;
            }
            user_menu.push(
                <DropdownMenu
                  key='account-dropdown'
                  label="Account"
                  isOpen={this.state.accountDropdownOpen}
                  onClick={() => this.handleDropdownToggleClick('account')}>
                    <li>
                        <Link to="/edit-profile">Edit Profile</Link>
                    </li>
                    <li>
                        <Link to="/change-password">Change Password</Link>
                    </li>
                    <li role="separator" className="divider"></li>
                    <li>
                        <a href="/logout">Logout</a>
                    </li>
                </DropdownMenu>
            );
        }
        return (
            <ul className="nav navbar-nav navbar-right">
                { user_menu }
            </ul>
        )
    }
}