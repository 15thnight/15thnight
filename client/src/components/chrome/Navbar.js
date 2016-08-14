import React from 'react';
import { Link } from 'react-router';


export default class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        }
    }

    componentDidMount() {
        document.body.addEventListener('click', this.handleBodyClick.bind(this));
    }

    componentWillUnmount() {
        document.body.removeEventListener('click', this.handleBodyClick.bind(this));
    }


    handleBodyClick(e) {
        if (!this.state.open) {
            return;
        }
        let element = e.target;
        while (element.tagName !== 'HTML' && element.id !== 'user_dropdown') {
            element = element.parentNode;
        }
        if (element.id !== 'user_dropdown') {
            this.setState({ open: false });
        }
    }

    handleDropdownToggleClick(e) {
        e.preventDefault();
        this.setState({ open: !this.state.open });
    }

    render() {
        let { current_user } = this.props;
        let user_menu = (<li><Link to="/login">Login</Link></li>);
        let dropdownClass = 'dropdown';
        if (this.state.open) {
            dropdownClass += ' open';
        }
        if (current_user) {
            user_menu = (
                <li id="user_dropdown" className={dropdownClass}>
                    <a href="#" className="dropdown-toggle" onClick={this.handleDropdownToggleClick.bind(this)}>
                        {current_user.email}
                        <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu">
                        <li><Link to="/edit-profile">Edit Profile</Link></li>
                        <li><Link to="/change-password">Change Password</Link></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="/logout">Logout</a></li>
                    </ul>
                </li>
            )
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
                            { current_user &&
                                <li><Link to="/dashboard">Dashboard</Link></li> }
                            <li><Link to="/about">About</Link></li>
                            { user_menu }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}