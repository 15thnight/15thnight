import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';

import DropdownMenu from './DropdownMenu';


const USER_LINKS = {
    provider: [
        { to: '/active-alerts',    text: "Active Alerts" },
        { to: '/responded-alerts', text: "Responded Alerts" },
        { to: '/all-alerts',       text: "All Alerts" },
        { to: '/help',             text: "Help" },
    ],
    advocate: [
        { to: '/send-alert',    text: 'Send an Alert' },
        { to: '/alert-history', text: 'Alert History' },
        { to: '/help',          text: 'Help' },
    ],
    admin: [{ to: '/alert-history', text:'Alert History' }],
    anonymous: [{ to: '/login', text: 'Login' }],
}

const ADMIN_DROPDOWN_LINKS = [
    { to: "/manage-users", text: "Users" },
    { to: "/manage-categories", text: "Categories" },
    { to: "/manage-services", text: "Services" },
]

const USER_DROPDOWN_LINKS = [
    { to: '/edit-profile',    text: 'Edit Profile' },
    { to: '/change-password', text: 'Change Password'},
    { divider: true },
    { href: '/logout',        text: 'Logout'}
]

export default class NavbarLinks extends React.Component {
    state = {
        accountDropdownOpen: false,
        manageDropdownOpen: false,
    }

    componentDidMount = () =>
        document.body.addEventListener('click', this.handleBodyClick);

    componentWillUnmount = () =>
        document.body.removeEventListener('click', this.handleBodyClick);

    handleBodyClick = e => {
        if (!this.state.accountDropdownOpen && !this.state.manageDropdownOpen) {
            return;
        }
        let element = e.target;
        while (element.tagName.toUpperCase() !== 'HTML') {
            if (element.className.indexOf('dropdown-toggle') >= 0) {
                return;
            }
            element = element.parentNode;
        }
        this.setState({ accountDropdownOpen: false, manageDropdownOpen: false });
    }

    toggleDropdown = menu => this.setState({
        accountDropdownOpen: menu === 'account' ? !this.state.accountDropdownOpen : false,
        manageDropdownOpen: menu === 'manage' ? !this.state.manageDropdownOpen : false
    });

    render() {
        const { current_user, pathname } = this.props;
        const role = current_user ? current_user.role : 'anonymous';
        const { manageDropdownOpen, accountDropdownOpen } = this.state;
        return (
            <ul className="nav navbar-nav navbar-right">
                {USER_LINKS[role].map(({ to, text }, key) =>
                    <li key={key} className={cx({ active: to === pathname })}>
                        <Link to={to}>{text}</Link>
                    </li>
                )}
                {role === 'admin' &&
                    <DropdownMenu
                      label="Manage"
                      isOpen={manageDropdownOpen}
                      onClick={e => this.toggleDropdown('manage')}
                      links={ADMIN_DROPDOWN_LINKS}
                    />
                }
                {current_user &&
                    <DropdownMenu
                      label="Account"
                      isOpen={accountDropdownOpen}
                      onClick={e => this.toggleDropdown('account')}
                      links={USER_DROPDOWN_LINKS}
                    />
                }
            </ul>
        )
    }
}
