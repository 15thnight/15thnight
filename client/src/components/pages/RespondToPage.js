import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { InputField } from 'form';
import {
    getAlert, sendResponse, clearFormStatus
} from 'actions';

class RespondToPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            alert: null,
            message: '',
            error: { }
        }
    }

    componentWillMount() {
        this.props.getAlert(this.props.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.clearFormStatus();
            return this.props.router.push('/dashboard');
        }
        if (nextProps.alert[this.props.params.id]) {
            this.setState({
                alert: nextProps.alert[this.props.params.id]
            })
        }
    }

    handleInputChange(name, e) {
        this.setState({ [name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ error: {} });
        this.props.sendResponse({
            alert_id: this.props.params.id,
            message: this.state.message
        });
    }

    renderErrors(errors) {
        if (!errors || errors.length === 0) {
            return null;
        }
        return (
            <div className="row">
                {errors.map((error, key) => {
                    return (<div key={key} className="error">{error}</div>);
                })}
            </div>
        )
    }

    render() {
        if (!this.state.alert) {
            return (<h1 className="text-center">Loading Alert...</h1>);
        }
        let { alert } = this.state;
        let needs ;
        return (
           <div className="text-center col-sm-offset-3 col-sm-6">
                <h2>Alert</h2>
                <h3>Date/Time: { alert.created_at }</h3>
                <h3>Age: { alert.age }</h3>
                <h3>Gender: { alert.gender }</h3>
                <h3>Needs: { needs }</h3>
                <h3>Message: { alert.description }</h3>
                <br/>
                <h4>If you want to help, type a message and click submit below:</h4>
                <form className="form-horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    <InputField
                      type="textarea"
                      label="Response Message"
                      name="message"
                      value={this.state.message}
                      errors={this.state.error.message}
                      onChange={this.handleInputChange.bind(this)} />
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
        submitFormSuccess: state.submitFormSuccess,
        submitFormError: state.submitFormError
    }
}

export default connect(mapStateToProps, {
    getAlert,
    sendResponse,
    clearFormStatus
})(withRouter(RespondToPage));