import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';


export default /* DropdownMenu */ ({ label, children, onClick, isOpen, links }) => (
    <li key='mobile' className={cx('dropdown', { open: isOpen })}>
        <a href="#" className="dropdown-toggle hidden-sm hidden-md hidden-lg">
            {label}
        </a>
        <a href="#" className="dropdown-toggle hidden-xs" onClick={onClick}>
            {label}
            <span className="caret"></span>
        </a>
        <ul className="dropdown-menu">
            {links.map(({ to, href, text, divider }, key) => (
                <li key={key} className={cx({ divider })}>
                    {to && <Link to={to}>{text}</Link>}
                    {href && <a href={href}>{text}</a>}
                </li>
            ))}
        </ul>
    </li>
);
