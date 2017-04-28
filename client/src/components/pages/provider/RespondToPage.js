import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { AlertInfo } from 'alert';
import { FormErrors, FormGroup, Input } from 'form';
import { getAlert, sendResponse } from 'api';

import classes from './RespondToPage.css';

class RespondToPage extends React.Component {
    state = {
        checked: [],
        message: {},
        error: {}
    }

    componentWillMount() {
        this.props.getAlert(this.props.params.id);
    }

    componentWillReceiveProps({ request: { started, error, success, symbol } }) {
        if (this.props.request.started &&
                !started && success &&
                symbol === sendResponse.symbol) {
            this.props.router.push('/');
        }
    }

    focusMessage(id) {
        ReactDOM.findDOMNode(this.refs['textarea' + id].refs.input).focus();
    }

    handleSubmit = e => {
        e.preventDefault();
        let error = {};
        this.setState({ error });
        if (this.state.checked.length === 0) {
            error['form'] = ['You must select at least one need you can provide help for.']
            return this.setState({ error });
        }
        let hasError = false;
        let needs_provided = [];
        this.state.checked.map(need_id => {
            let message = this.state.message[need_id];
            if (!message) {
                error[need_id] = ['Please provide details about what you can provide.'];
                hasError = true;
            } else {
                needs_provided.push({ need_id, message });
            }
        });
        if (hasError) {
            return this.setState({ error });
        }
        this.props.sendResponse({
            alert_id: this.props.params.id,
            needs_provided
        });
    }

    toggleNeed(id) {
        this.setState({ error: {} });
        let { checked } = this.state;
        if (checked.indexOf(id) < 0) {
            checked.push(id);
        } else {
            checked = checked.filter(need_id => need_id !== id)
        }
        this.setState({ checked }, () => {
            this.focusMessage(id);
        });
    }

    handleMessageClick = id => {
        this.toggleNeed(id);
    }

    handleCheckboxChange = id => {
        this.toggleNeed(id);
    }

    handleMessageChange = (id, value) => {
        let { message } = this.state;
        message[id] = value;
        this.setState({ message });
    }

    render() {
        const { alert } = this.props;
        if (!alert) {
            return (<h1 className="text-center">Loading Alert...</h1>);
        }
        return (
           <div className={"text-center col-md-offset-3 col-md-6 " + classes.respondToPage}>
                <h2>Alert</h2>
                {
                    alert.responses.length > 0 &&
                    <h3>You have responed to this alert { alert.responses.length } time{ alert.responses.length > 1 && 's'}.</h3>
                }
                <AlertInfo alert={alert} />
                <br/>
                <h4 className="needFormStart">
                    Please select the services for which you can
                    provide assistance.
                    Provide any pertinent details in the text boxes:
                </h4>
                <FormErrors errors={this.state.error.form} />
                <form className="form-horizontal" onSubmit={this.handleSubmit}>
                    {alert.needs.map(({ service, provisions, id, resolved }) => (
                        <FormGroup
                          label={service.name}
                          key={id}
                          id={"need" + id}
                          className="need">
                            {resolved &&
                                <div>
                                    This need has already been pledged by
                                    another partner agency. If you are still
                                    willing and able to fulfill it as a backup,
                                    please respond with details in the description
                                    box.
                                </div>
                            }
                            {provisions.length > 0 &&
                                <div className="form-group">
                                    <div className="col-xs-offset-1 col-xs-11">
                                        <div>
                                            <div>You have responded to this need {provisions.length} time{provisions.length > 1 && 's'}</div>
                                            {provisions.map(({ created_at, message }) => (
                                                <div>
                                                    <div>{ created_at }</div>
                                                    <div>Message: { message }</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="form-group">
                                <div className="col-xs-1">
                                    <Input
                                      type="checkbox"
                                      onChange={e => this.handleCheckboxChange(id)}
                                      checked={this.state.checked.indexOf(id) >= 0} />
                                </div>
                                <div className="col-xs-11">
                                    <Input
                                      type="textarea"
                                      name={id}
                                      placeholder={"Enter details about what you can provide for " + service.name}
                                      disabled={this.state.checked.indexOf(id) < 0}
                                      ref={'textarea' + id}
                                      value={this.state.message[id] || ''}
                                      onChange={this.handleMessageChange}
                                    />
                                    {this.state.checked.indexOf(id) < 0 &&
                                        <div
                                          className="textareaMask"
                                          onClick={() => this.handleMessageClick(id)}
                                        />
                                    }
                                    <FormErrors errors={this.state.error[id]} />
                                </div>
                            </div>
                        </FormGroup>
                    ))}
                    <br/>
                    <button className="btn btn-lg btn-success" type="submit">
                        Submit
                    </button>
                </form>
           </div>
        );
    }
}

const mapStateToProps = ({ alert, alertRedirect, request }, { params: { id }}) =>
    ({ alert: alert[id], alertRedirect, request });

export default connect(mapStateToProps, {
    getAlert,
    sendResponse,
})(withRouter(RespondToPage));
