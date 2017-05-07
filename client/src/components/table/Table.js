import React from 'react';
import cx from 'classnames';


// Flatten out any children that are arrays, and filter by component type
const filterByType = (children, filter) =>
    children.reduce((acc, child) => acc.concat(child), [])
        .filter(({ type }) => type === filter);

const Table = ({ className, children }) => (
    <div className={cx('table-responsive', className)}>
        <table className="table">
            <thead>{filterByType(children, Table.Header)}</thead>
            <tbody>{filterByType(children, Table.Row)}</tbody>
        </table>
    </div>
);

Table.Header = ({ children }) => (<tr>{children}</tr>);

Table.Row = ({ children }) => (<tr>{children}</tr>);

export default Table;
