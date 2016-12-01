import React from 'react';


export default function DropdownMenu(props) {
    const { label, children, isOpen } = props;
    let className = 'dropdown';
    if (isOpen) {
        className += ' open';
    }
    return (
        <li key='mobile' className={className}>
            <a href="#" className="dropdown-toggle hidden-sm hidden-md hidden-lg">
                {label}
            </a>
            <a href="#" className="dropdown-toggle hidden-xs" onClick={props.onClick}>
                {label}
                <span className="caret"></span>
            </a>
            <ul className="dropdown-menu">{children}</ul>
        </li>
    );
}