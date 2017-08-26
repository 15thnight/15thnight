import React from 'react';
import cx from 'classnames';
import moment from 'moment-timezone';

import classes from './Timestamp.css';

export default class Timestamp extends React.Component {
    state = {
        ticker: new Date()
    }

    componentDidMount() {
        if (this.props.fromNow || this.props.fromNowOnly) {
            this.tickerInterval = setInterval(() => this.setState({ ticker: new Date() }), 30000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.tickerInterval);
    }

    getMoment = () => moment.tz(this.props.time, moment.tz.guess());

    render() {
        const { multiLine, className, fromNow, fromNowOnly } = this.props;
        return (
            <span className={cx(classes.timeStamp, className)}>
                {(fromNow || fromNowOnly) && this.getMoment().fromNow()}
                {fromNow && <br/>}
                {!fromNowOnly && this.getMoment().format(multiLine ? 'LT' : 'lll')}
                {multiLine && <br/>}
                {multiLine && this.getMoment().format('ll')}
            </span>
        );
    }
}
