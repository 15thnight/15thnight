import React from 'react';


export default class AdminWelcome extends React.Component {

    render() {
        return (
            <div className="tab-pane active text-center">
                <h2>Welcome back to the 15th night app.</h2>
                <p>
                    Here you can manage users and see all the alert history along with the responses.
                </p>
            </div>
        )
    }
}