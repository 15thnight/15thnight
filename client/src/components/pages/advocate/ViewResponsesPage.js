import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';


import {
    getAlert,
    resolveAlertNeed,
    unresolveAlertNeed
} from 'actions';
import { AlertInfo, Provisions } from 'alert';
import { FormGroup } from 'form';

import styles from './ViewResponsesPage.css';


class ViewResponsesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            showResolveHistory: {}
        }
    }

    componentWillMount() {
        this.props.getAlert(this.props.params.id);
    }

    componentWillReceiveProps(nextProps) {
        let alert = nextProps.alert[this.props.params.id]
        if (alert) {
            this.setState({ alert });
        }
    }

    handleMarkResolvedClick(needId) {
        this.props.resolveAlertNeed(this.props.params.id, needId);
    }

    handleUnmarkResolvedClick(needId) {
        this.props.unresolveAlertNeed(this.props.params.id, needId);
    }

    handleResolveHistoryClick(needId, show, e) {
        e.preventDefault();
        let { showResolveHistory } = this.state;
        showResolveHistory[needId] = show;
        this.setState({ showResolveHistory });
    }

    render() {
        let { alert } = this.state;
        let { current_user } = this.props;
        if (!alert) {
            return (<h1 className="text-center">Loading Alert...</h1>);
        }
        let totalResolved = alert.needs.reduce((total, need) => { return need.resolved ? total + 1 : total }, 0);
        let percentResolved = (totalResolved / alert.needs.length) * 100;
        return (
            <div className="text-center col-md-offset-3 col-md-6">
                <h1>Alert Responses</h1>
                <AlertInfo alert={alert} />
                <div className={styles.resolveProgress}>
                    <div className={styles.progressLine} style={{width: percentResolved + '%'}}/>
                    <div className={styles.progressPercent}>
                        {Math.round(percentResolved)} % Resolved
                    </div>
                </div>
                <div className="form-horizontal">
                    {alert.needs.map((need, key) => {
                        let { service, provisions } = need;
                        return (
                            <FormGroup
                              label={service.name + ':'}
                              key={need.id}
                              id={"need" + key}
                              className={styles.need}>
                                <div>
                                    <strong>Status: </strong>
                                    { need.resolved ?
                                        <span className={styles.resolved}>Resolved</span> :
                                        <span className={styles.unresolved}>Unresolved</span>
                                    }
                                </div>
                                { need.resolved ?
                                    <div>
                                        <strong>Resolved at: </strong>
                                        { need.resolved_at }
                                        <br/>
                                    </div> :
                                    current_user.role === 'advocate' &&
                                        <div>
                                            <Link
                                              className="btn btn-success"
                                              to={'/resolve-need/' + need.id}
                                            >
                                                Mark as Resolved
                                            </Link>
                                        </div>
                                }
                                {
                                    this.state.showResolveHistory[need.id] &&
                                    need.resolve_history.reverse().map(history => {
                                        return (
                                            <div>
                                                <span className={styles.resolveHistoryStatus}>
                                                    { history.resolved ?
                                                        <span className={styles.resolved}>Resolved</span> :
                                                        <span className={styles.unresolved}>Unresolved</span>
                                                    }
                                                </span>
                                                <span> at { history.resolved_at }</span>
                                            </div>
                                        )
                                    })
                                }
                                <div>
                                    <strong>Responses: </strong>
                                    {
                                        provisions.length === 0 &&
                                        <span>None received yet</span>
                                    }
                                </div>
                                <Provisions provisions={provisions}/>
                            </FormGroup>
                        );
                    })}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        current_user: state.current_user,
        alert: state.alert
    }
}

export default connect(mapStateToProps, {
    getAlert,
    resolveAlertNeed,
    unresolveAlertNeed
})(ViewResponsesPage);