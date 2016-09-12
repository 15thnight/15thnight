import React from 'react';
import { connect } from 'react-redux';


import { getAlert, resolveAlertNeed } from 'actions';
import { AlertInfo } from 'alert';
import { FormGroup } from 'form';

import styles from './ViewResponsesPage.css';


function ProvisionRow(props) {
    return (
        <div>
            <span className={styles.provisionLabel}>
                {props.label}
            </span>
            <span className={styles.provisionField}>
                {props.children}
            </span>
        </div>
    )
}

class ViewResponsesPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: null
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

    render() {
        let { alert } = this.state;
        if (!alert) {
            return (<h1 className="text-center">Loading Alert...</h1>);
        }
        let totalResolved = alert.needs.reduce((total, need) => { return need.resolved ? total + 1 : total }, 0);
        let percentResolved = (totalResolved / alert.needs.length) * 100;
        return (
            <div className="text-center col-sm-offset-3 col-sm-6">
                <h1>Alert Responses</h1>
                <AlertInfo alert={alert} />
                <div className={styles.resolveProgress}>
                    <div className={styles.progressLine} style={{width: percentResolved + '%'}}/>
                    <div className={styles.progressPercent}>
                        {Math.round(percentResolved)} % Resolved
                    </div>
                </div>
                <div className="form-horizontal">
                    {alert.needs.map(need => {
                        let { service, provisions } = need;
                        return (
                            <FormGroup
                              label={service.name + ':'}
                              key={need.id}
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
                                    </div> :
                                    <div>
                                        <span
                                          className="btn btn-success"
                                          onClick={this.handleMarkResolvedClick.bind(this, need.id)}
                                        >
                                            Mark as Resolved
                                        </span>
                                    </div>
                                }
                                <div>
                                    <strong>Responses: </strong>
                                    {
                                        provisions.length === 0 &&
                                        <span>None received yet</span>
                                    }
                                </div>
                                {provisions.length > 0 && provisions.map(provision => {
                                    let { provider } = provision;
                                    return (
                                        <div className={styles.provision}>
                                            <ProvisionRow label={"From:"}>
                                                { provider.name } <strong>&middot; </strong>
                                                { provider.phone_number} <strong>&middot; </strong>
                                                { provider.email }
                                            </ProvisionRow>
                                            <ProvisionRow label={"Sent at:"}>
                                                { provision.created_at }
                                            </ProvisionRow>
                                            <ProvisionRow label={"Message:"}>
                                                { provision.message }
                                            </ProvisionRow>
                                        </div>
                                    )
                                })}
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
        alert: state.alert
    }
}

export default connect(mapStateToProps, {
    getAlert,
    resolveAlertNeed
})(ViewResponsesPage);