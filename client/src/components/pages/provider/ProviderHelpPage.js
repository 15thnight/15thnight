import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Form, InputField } from 'c/form';
import { sendHelpMessage } from 'api';
import { withRequests } from 'react-requests';


@withRouter
@withRequests
@connect(null, { sendHelpMessage })
export default class ProviderHelpPage extends React.Component {
    state = {
        message: '',
        error: {}
    }

    componentWillMount() {
        this.props.observeRequest(sendHelpMessage, {
            end: () => this.props.router.push('/'),
            error: error => this.setState({ error })
        });
    }

    handleSubmit = e => {
        const { message } = this.state;
        const data = { message };
        this.props.sendHelpMessage({ data });

    }

    onChange = (name, message) => {
        this.setState({ message });
    }

    render() {
        const { message, error } = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>Contact Help</h1>
                <p>Your message will be sent to OSLC support.</p>
                <InputField
                  label="Enter your message"
                  type="textarea"
                  name="message"
                  errors={error.message}
                  value={message}
                  onChange={this.onChange}
                />
                <br/>
                <button className="btn btn-success">Send Message</button>
            </Form>
        )
    }
}
