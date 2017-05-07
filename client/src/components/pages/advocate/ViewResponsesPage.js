import React from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import Immutable from 'seamless-immutable';

import { getAlert, resolveNeed } from 'api';
import { AlertInfo, Pledge } from 'c/alert';
import Button from 'c/button';
import { Input, Form, FormGroup, Loading, StaticField } from 'c/form';
import Timestamp from 'c/timestamp';

import classes from './ViewResponsesPage.css';


@connect(
    ({ current_user, alert }, { params: { id }}) =>
        ({ current_user, id, alert: alert[id] }),
    { getAlert }
)
export default class ViewResponsesPage extends React.Component {
    didAnimateProgress = false;
    state = {
        showUnselected: Immutable({}),
        expandedPledge: Immutable({})
    }
    componentWillMount() {
        const { id } = this.props;
        this.props.getAlert({ id });
    }

    componentDidUpdate() {
        if (this.progressBar && !this.didAnimateProgress) {
            setTimeout(this.animateWidth, 100);
            this.didAnimateProgress = true
        }
    }

    animateWidth = () =>
        this.progressBar.style.width = this.getPercentResolved(this.props.alert)

    getPercentResolved = ({ needs, totalResolved }) =>
        `${Math.round((totalResolved / needs.length) * 100)}%`;

    toggleShowUnselected = id => this.setState(({ showUnselected }) =>
        ({ showUnselected: showUnselected.merge({ [id]: !showUnselected[id]}) }));

    renderResolveButton = id => (
        <Button lg style="success" to={`/view/${this.props.id}/resolve/${id}`}>
            Mark as Resolved
        </Button>
    );

    handleResolveAllClick = () =>
        this.props.resolveAllNeeds(this.props.params.id, this.state.notifyProvidersAllResolved);

    renderPledge = (pledge, key) => <Pledge key={key} {...pledge} />

    renderConfirmResolveAll = ({ notifyProvidersAllResolved }) => (
        <div className="col-sm-offset-3 col-sm-6">
            <div className="btn btn-primary btn-lg" onClick={e => this.setState({ confirmResolveAll: false })}>
                Go back to Alert
            </div>
            <br/>
            <h3 className="text-center">
                Are you sure you wish to resolve all unresolved needs?
            </h3>
            <br/><br/>
            <div className="text-center form-horizontal">
                <div onClick={e => this.setState({ notifyProvidersAllResolved: !notifyProvidersAllResolved })}>
                    <Input type="checkbox" checked={notifyProvidersAllResolved} />
                    <span>
                        Check this box to send a text message and email to all
                        notified providers that the alert is closed.
                    </span>
                </div>
                <br/>
                <div className="btn btn-danger btn-lg" onClick={this.handleResolveAllClick}>
                    Resolve All Unresolved Needs
                </div>
            </div>
        </div>
    )

    render() {
        const { current_user, alert } = this.props;
        const { showUnselected, confirmResolveAll } = this.state;
        if (!alert) {
            return <Loading title="Alert" />;
        }
        if (confirmResolveAll) {
            return this.renderConfirmResolveAll(this.state);
        }
        const { totalResolved } = alert;
        return (
            <Form className={classes.viewResponsesPage} centered={false}>
                <h1 className="text-center">Alert Responses</h1>
                <AlertInfo alert={alert} />
                {current_user.role === 'admin' && totalResolved !== alert.needs.length &&
                    <div className="text-center">
                        <div className="btn btn-lg btn-primary" onClick={e => this.setState({ confirmResolveAll: true })}>
                            Resolve All Unresolved Needs
                        </div>
                        <br/>
                    </div>
                }
                <div className="progress text-center">
                    <div className="progress-bar progress-bar-success" ref={e => this.progressBar = e} />
                    <div className="percent">{this.getPercentResolved(alert)} Resolved</div>
                </div>
                <div className="form-horizontal">
                    {alert.needs.map(({ service_name, pledges, id, resolved, resolved_at }, key) => (
                        <div key={id} className="need">
                            <div className="hidden-sm hidden-md hidden-lg">
                                <h3>{service_name}</h3>
                                <div>{!resolved && this.renderResolveButton(id)}</div>
                            </div>
                            <div className="row">
                                <div className="col-sm-8 col-xs-7">
                                    <h3 className="hidden-xs">{service_name}</h3>
                                    <div>
                                        <strong>Status: </strong>
                                        {resolved && <span className="resolved">Resolved</span>}
                                        {!resolved && <span className="unresolved">Unresolved</span>}
                                    </div>
                                    <div>
                                        {pledges.length === 0 && <span>No pledges received yet</span>}
                                        {pledges.length > 0 && !resolved &&
                                            <span>Received {pledges.length} pledge{pledges.length > 1 && 's'}</span>
                                        }
                                        {pledges.length > 0 && resolved &&
                                            <span>Selected {pledges.filter(p => p.selected).length} pledge{pledges.filter(p => p.selected).length !== 1 && 's'}</span>
                                        }
                                    </div>
                                </div>
                                <div className="col-sm-4 col-xs-5 text-right">
                                    {resolved &&
                                        <span>
                                            <strong>Resolved: </strong>
                                            <Timestamp time={resolved_at} multiLine fromNow />
                                        </span>
                                    }
                                    <span className="hidden-xs">{!resolved && this.renderResolveButton(id)}</span>
                                </div>
                            </div>
                            <div className={classes.pledges}>
                                {pledges.filter(p => resolved ? p.selected : true).map(this.renderPledge)}
                                {resolved && pledges.filter(p => !p.selected).length > 0 &&
                                    <a onClick={e => this.toggleShowUnselected(id)}>
                                        {showUnselected[id] ? 'Hide' : 'Show'} {pledges.filter(p => !p.selected).length} unselected pledges
                                    </a>
                                }
                                {resolved && showUnselected[id] && pledges.filter(p => !p.selected).map(this.renderPledge)}
                            </div>
                        </div>
                    ))}
                </div>
            </Form>
        );
    }
}
