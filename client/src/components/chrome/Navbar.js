import React from 'react';
import { Link } from 'react-router';


export default class Navbar extends React.Component {

    render() {
        let { current_user } = this.props;
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
                                <li><a>{current_user.email}</a></li> }
                            { current_user &&
                                <li><Link to="/dashboard">Dashboard</Link></li> }
                            <li><Link to="/about">About</Link></li>
                            { current_user &&
                                <li><a href="/logout">Logout</a></li> }
                            { !current_user &&
                                <li><Link to="/login">Login</Link></li> }
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}