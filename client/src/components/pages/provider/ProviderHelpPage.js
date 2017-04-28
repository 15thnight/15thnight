import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { sendHelpMessage } from 'api';
import { InputField } from 'form';
import { checkRequest } from 'util';


class ProviderHelpPage extends React.Component {
    state = {
        message: '',
        error: {}
    }

    componentWillReceiveProps({ request }) {
        checkRequest(this.props.request, request, sendHelpMessage,
            () => this.props.router.push('/'),
            error => this.setState({ error })
        );
    }

    handleSubmit = e => {
        e.preventDefault();
        const { message } = this.state;
        this.props.sendHelpMessage({ message });

    }

    onChange = (name, message) => {
        this.setState({ message });
    }

    render() {
        const { message, error } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3 text-center">
                <h1>Contact Help</h1>
                <p>Your message will be sent to OSLC support.</p>
                <form className="form-horizontal" onSubmit={this.handleSubmit}>
                    <InputField
                      label="Enter your message"
                      type="textarea"
                      name="message"
                      errors={error.message}
                      value={message}
                      onChange={this.onChange} />
                    <br/>
                    <button className="btn btn-success">Send Message</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = ({ request }) => ({ request });

export default connect(mapStateToProps, {
    sendHelpMessage
})(withRouter(ProviderHelpPage));
