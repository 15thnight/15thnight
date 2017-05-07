import React from 'react';
import cx from 'classnames';
import Immutable from 'seamless-immutable';

import Button from 'c/button';
import Icon from 'c/icon';

import classes from './Sortable.css';

export default class Sortable extends React.Component {
    handleSort = direction => () => {
        const sortToSwap = this.props.tmpSort;
        const isUp = direction === 'up';
        const swapSort = sortToSwap + (isUp ?  -1 : 1);
        const items = Immutable([].concat(this.props.items.map(item => {
            const { tmpSort } = item;
            if (tmpSort === swapSort) {
                return item.merge({ tmpSort: tmpSort + (isUp ? 1 : -1) });
            } else if (tmpSort === sortToSwap) {
                return item.merge({ tmpSort: swapSort });
            }
            return item;
        })).sort((a, b) => a.tmpSort - b.tmpSort));
        this.props.onSort(items);
    }

    render() {
        const { items, idx } = this.props;
        const upClass = idx === 0 && classes.hidden;
        const downClass = idx === items.length - 1 && classes.hidden;
        return (
            <div className={classes.sortable}>
                <Button className={upClass} onClick={!upClass && this.handleSort('up')} type="button">
                    <Icon glyph="chevron-up" />
                </Button>
                <Button className={downClass} onClick={!downClass && this.handleSort('down')} type="button">
                    <Icon glyph="chevron-down" />
                </Button>
            </div>
        );
    }
}
