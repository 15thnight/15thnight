import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { AlertInfo } from 'alert';
import { FormErrors, FormGroup, Input } from 'form';
import {
    getAlert, sendResponse, clearFormStatus
} from 'actions';

import styles from './RespondToPage.css';

class RespondToPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            checked: [],
            message: {},
            error: {}
        }
    }

    componentWillMount() {
        this.props.getAlert(this.props.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.clearFormStatus();
            return this.props.router.push('/');
        }
        if (nextProps.alert[this.props.params.id]) {
            this.setState({
                alert: nextProps.alert[this.props.params.id]
            })
        }
    }

    focusMessage(id) {
        ReactDOM.findDOMNode(this.refs['textarea' + id].refs.input).focus();
    }

    handleSubmit(e) {
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

    handleMessageClick(need, e) {
        this.toggleNeed(need.id);
    }

    handleCheckboxChange(need, e) {
        this.toggleNeed(need.id);
    }

    handleMessageChange(id, value) {
        let { message } = this.state;
        message[id] = value;
        this.setState({ message });
    }

    render() {
        if (!this.state.alert) {
            return (<h1 className="text-center">Loading Alert...</h1>);
        }
        let { alert } = this.state;
        return (
           <div className="text-center col-sm-offset-3 col-sm-6">
                <h2>Alert</h2>
                {
                    alert.responses.length > 0 &&
                    <h3>You have responed to this alert { alert.responses.length } time{ alert.responses.length > 1 && 's'}.</h3>
                }
                <AlertInfo alert={alert} />
                <br/>
                <h4 className={styles.needFormStart}>
                    Please select the services for which you can
                    provide assistance.
                    Provide any pertinent details in the text boxes:
                </h4>
                <FormErrors errors={this.state.error['form']} />
                <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    {alert.needs.map((need, key) => {
                        let { service, provisions } = need;
                        return (
                            <FormGroup
                                label={service.name}
                                key={need.id}
                                id={"need" + key}
                                className={styles.need}>
                                {
                                    need.resolved &&
                                    <div>
                                        This need has already been pledged by 
                                        another partner agency. If you are still 
                                        willing and able to fulfill it as a backup,
                                        please respond with details in the description 
                                        box.
                                    </div>
                                }
                                {
                                    provisions.length > 0 &&
                                    <div className="form-group">
                                        <div className="col-sm-offset-1 col-sm-11">
                                            <div>
                                                <div>You have responded to this need {provisions.length} time{provisions.length > 1 && 's'}</div>
                                                { provisions.map(provision => {
                                                    return (
                                                        <div>
                                                            <div>{ provision.created_at }</div>
                                                            <div>Message: { provision.message }</div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="form-group">
                                    <div className="col-sm-1">
                                        <Input
                                          type="checkbox"
                                          onChange={this.handleCheckboxChange.bind(this, need)}
                                          checked={this.state.checked.indexOf(need.id) >= 0} />
                                    </div>
                                    <div className="col-sm-11">
                                        <Input
                                          type="textarea"
                                          name={need.id}
                                          placeholder={"Enter details about what you can provide for " + service.name}
                                          disabled={this.state.checked.indexOf(need.id) < 0}
                                          ref={'textarea' + need.id}
                                          value={this.state.message[need.id] || ''}
                                          onChange={this.handleMessageChange.bind(this)}/>
                                        {
                                            this.state.checked.indexOf(need.id) < 0 &&
                                            <div
                                              className={styles.textareaMask}
                                              onClick={this.handleMessageClick.bind(this, need)}></div>
                                        }
                                        <FormErrors errors={this.state.error[need.id]} />
                                    </div>
                                </div>
                            </FormGroup>
                        )
                    })}
                    <br/>
                    <button className="btn btn-lg btn-success" type="submit">
                        Submit
                    </button>
                </form>
           </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        alert: state.alert,
        alertRedirect: state.alertRedirect,
        submitFormSuccess: state.submitFormSuccess,
        submitFormError: state.submitFormError
    }
}

export default connect(mapStateToProps, {
    getAlert,
    sendResponse,
    clearFormStatus
})(withRouter(RespondToPage));