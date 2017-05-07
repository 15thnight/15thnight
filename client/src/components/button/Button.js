import React from 'react';
import { Link } from 'react-router';
import cx from 'classnames';


const getButtonClassName = (lg, className, style) =>
    cx('btn', `btn-${style}`, { 'btn-lg': lg }, className);

export default /* Button */ ({ to, lg, onClick, className, style="primary", type="submit", children }) => (
    to ?
        <Link to={to} className={getButtonClassName(lg, className, style)}>{children}</Link> :
        <button type={type} className={getButtonClassName(lg, className, style)} onClick={onClick}>{children}</button>
)
