import React from 'react';
import cx from 'classnames';
import TextTruncate from 'react-text-truncate';

import Icon from 'c/icon';
import Timestamp from 'c/timestamp';

import PledgeInfo from './PledgeInfo';

import classes from './Pledge.css';


export default class Pledge extends React.Component {
    state = {
        expanded: false
    }

    handleExpand = e => this.setState({ expanded: true });

    handleCollapse = e => this.setState({ expanded: false });

    renderExpanded = props => (
        <div>
            <a className={classes.collapseButton} onClick={this.handleCollapse}>
                Collapse Pledge
            </a>
            <PledgeInfo {...props} />
        </div>
    )

    renderCollapsed = ({ provider, message, created_at, noProvider }) => (
        <div className='row'>
            {!noProvider &&
                <strong className="col-sm-3 text-right">
                    <TextTruncate line={1} text={provider.name} />
                    <TextTruncate line={1} text={provider.organization} />
                </strong>
            }
            <div className={cx(`col-sm-${noProvider ? '9' : '6'} hidden-xs text-left`, classes.collapsedLine)}>
                <TextTruncate line={2} text={message} />
            </div>
            <div className={cx("col-sm-3 hidden-xs text-right timestamp", classes.collapsedLine)}>
                <Timestamp time={created_at} fromNowOnly />
            </div>
            <div className="col-xs-6 hidden-sm hidden-md hidden-lg">
                <Timestamp time={created_at} fromNowOnly className="timestamp" />
                <TextTruncate line={1} text={message} />
            </div>
        </div>
    );

    render() {
        const { expanded } = this.state;
        const { alwaysExpanded } = this.state;
        const className = cx(classes.pledge, {
            [classes.expandedPledge]: expanded
        });
        return (
            <div className={className} onClick={!expanded && this.handleExpand}>
                {!expanded && <Icon glyph="chevron-right" />}
                {(expanded ? this.renderExpanded : this.renderCollapsed)(this.props)}
            </div>
        )
    }
}
