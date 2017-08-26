import React from 'react';
import { connect } from 'react-redux';
import {
    error as errorFlash,
    success as successFlash,
    hide as hideFlash
} from 'react-notification-system-redux';

import { sendAlert, updateProfile } from 'api';
import { withRequests } from 'react-requests';
import systemMessages from 'messages';


@withRequests
@connect(null, { successFlash, errorFlash, hideFlash })
export default class Flash extends React.Component {
    componentDidMount() {
        const position = 'br';
        Object.keys(systemMessages).map(apiMethod => {
            const makeUid = () => `${apiMethod} ${new Date()}`;
            const systemMessage = systemMessages[apiMethod];
            let uid = makeUid();
            const callbacks = { every: () => this.props.hideFlash(uid) };
            if (systemMessage.success) {
                callbacks.end = () => {
                    uid = makeUid();
                    const title = 'Successfully ' + systemMessage.success;
                    this.props.successFlash({ title, position, uid });
                };
            }
            if (systemMessage.error) {
                callbacks.error = error => {
                    uid = makeUid();
                    const message = systemMessage.isForm !== false && this.renderFormErrors(error);
                    const title = 'Failed to ' + systemMessage.error;
                    const autoDismiss = systemMessage.errorAutodismiss || 0;
                    this.props.errorFlash({ title, message, position, autoDismiss, uid });
                }
            }
            this.props.observeRequest(apiMethod, callbacks);
        });
    }

    capFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

    renderFormErrors = error => (
        <div>
            <div>Please fix the following errors:</div>
            <br/>
            {Object.keys(error).map(key =>
                <div key={key}>
                    <div>{this.capFirst(key)}</div>
                    <ul>
                        {error[key].map((msg, key) => <li key={key}>{msg}</li>)}
                    </ul>
                </div>
            )}
        </div>
    )

    render = () => null;
}
