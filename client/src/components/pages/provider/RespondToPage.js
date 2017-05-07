import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import Immutable from 'seamless-immutable';

import { getAlert, sendResponse } from 'api';
import { withRequests } from 'react-requests';
import { AlertInfo, Pledge } from 'c/alert';
import Button from 'c/button';
import { Form, FormErrors, FormGroup, Input, Loading } from 'c/form';
import Timestamp from 'c/timestamp';

import classes from './RespondToPage.css';


@withRouter
@withRequests
@connect(
    ({ alert, alertRedirect }, { params: { id }}) =>
        ({ alert: alert[id], id, alertRedirect }),
    { getAlert, sendResponse }
)
export default class RespondToPage extends React.Component {
    state = {
        pledged: [],
        message: Immutable({}),
        error: {}
    }

    componentWillMount() {
        const { id } = this.props;
        this.props.getAlert({ id });
        this.props.observeRequest(sendResponse, {
            end: () => this.props.router.push('/'),
            error: error => this.setState({ error })
        });
    }

    focusMessage(id) {
        ReactDOM.findDOMNode(this.refs['textarea' + id].refs.input).focus();
    }

    handleSubmit = e => {
        this.setState({ error: {} });
        const error = {};
        if (this.state.pledged.length === 0) {
            error.form = ['You must select at least one need you can provide help for.']
            return this.setState({ error });
        }
        let hasError = false;
        const pledges = this.state.pledged.reduce((acc, need_id) => {
            const message = this.state.message[need_id];
            if (!message) {
                error[need_id] = ['Please provide details about what you can provide.'];
                hasError = true;
            } else {
                acc.push({ need_id, message });
            }
            return acc;
        }, []);
        if (hasError) {
            return this.setState({ error });
        }
        const alert_id = parseInt(this.props.id);
        this.props.sendResponse({ data: { alert_id, pledges } });
    }

    toggleNeed = id => () => {
        this.setState({ error: {} });
        const shouldRemove = this.state.pledged.includes(id);
        const pledged = shouldRemove ?
            this.state.pledged.filter(need_id => need_id !== id) :
            [...this.state.pledged, id];
        this.setState({ pledged }, () => !shouldRemove && this.focusMessage(id));
    }

    handleMessageChange = (id, value) =>
        this.setState({ message: this.state.message.merge({ [id]: value }) });

    renderPledgeButton = id => (
        !this.state.pledged.includes(id)
            ? <Button lg type="button" onClick={this.toggleNeed(id)}>Pledge this need</Button>
            : <Button lg style="danger" type="button" onClick={this.toggleNeed(id)}>Cancel Pledge</Button>
    );

    render() {
        const { alert } = this.props;
        if (!alert) {
            return <Loading title="Alert" />;
        }
        const { responses, needs } = alert;
        const { pledged } = this.state;
        const submitButton = (
            <div className="text-center">
                <Button style="success" lg>Submit</Button>
            </div>
        );
        return (
            <Form
              className={classes.respondToPage}
              onSubmit={this.handleSubmit}
              centered={false}
            >
                <h2 className="text-center">Alert</h2>
                {responses > 0 &&
                    <h4 className="text-center">
                        You have responed to this alert { responses } time{ responses > 1 && 's'}.
                    </h4>
                }
                <AlertInfo alert={alert} />
                <br/>
                <h4 className="needFormStart">
                    Please select the services for which you can pledge assistance.
                    <br/>
                    Provide any pertinent details in the text boxes and click submit when done:
                </h4>
                <div className="text-center">
                    <FormErrors errors={this.state.error.form} />
                </div>
                {submitButton}
                <br/>
                {needs.map(({ service_name, pledges, id, resolved }) => (
                    <div key={id} className="need">
                        <div className="hidden-sm hidden-md hidden-lg">
                            <h3>{service_name}</h3>
                            <div>{this.renderPledgeButton(id)}</div>
                        </div>
                        <div className="row">
                            <div className="col-sm-8 col-xs-7">
                                <h3 className="hidden-xs">{service_name}</h3>
                            </div>
                            <div className="col-sm-4 col-xs-5 text-right">
                                <span className="hidden-xs">{this.renderPledgeButton(id)}</span>
                            </div>
                        </div>
                        {resolved &&
                            <div>
                                The need "{service_name}" has already been pledged by
                                another partner agency. If you are still
                                willing and able to fulfill it as a backup,
                                please respond with details in the description
                                box.
                            </div>
                        }
                        {pledged.includes(id) &&
                            <div>
                                <Input
                                  type="textarea"
                                  name={id}
                                  placeholder={"Enter details about what you can provide for " + service_name}
                                  ref={'textarea' + id}
                                  value={this.state.message[id] || ''}
                                  onChange={this.handleMessageChange}
                                />
                                <FormErrors errors={this.state.error[id]} />
                            </div>
                        }
                        {pledges.length > 0 &&
                            <div>
                                <h3>You have pledged to fulfill "{service_name}" {pledges.length} time{pledges.length > 1 && 's'}:</h3>
                                {pledges.map((pledge, key) => <Pledge {...pledge} noProvider />)}
                            </div>
                        }
                    </div>
                ))}
                <br/>
                {submitButton}
            </Form>
        );
    }
}
