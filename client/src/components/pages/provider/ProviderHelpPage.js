import React from 'react';
import { connect } from 'react-redux';

import {
    sendHelpMessage,
    clearFormStatus
} from 'actions';
import { InputField } from 'form';


class ProviderHelpPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            message: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.setState({ message: '' });
            return this.props.clearFormStatus();
        }
        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError });
            return this.props.clearFormStatus();
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.sendHelpMessage(this.state.message);

    }

    onChange(name, message) {
        this.setState({ message });
    }

    render() {
        let { message, error } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3 text-center">
                <h1>Contact Help</h1>
                <p>Your message will be sent to OSLC support.</p>
                <form className="form-horizontal" onSubmit={(e) => this.handleSubmit(e)}>
                    <InputField
                      label="Enter your message"
                      type="textarea"
                      name="message"
                      errors={error}
                      value={this.state.message}
                      onChange={this.onChange.bind(this)} />
                    <br/>
                    <button className="btn btn-success">Send Message</button>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        submitFormSuccess: state.submitFormSuccess,
        submitFormError: state.submitFormError
    }
}

export default connect(mapStateToProps, {
    sendHelpMessage,
    clearFormStatus
})(ProviderHelpPage);