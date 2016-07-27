import React from 'react';
import ReactDOM from 'react-dom';


class AppEntry extends React.Component {
    getInitialState() {
        return {}
    }

    render() {
        return (
            <div>15th Night</div>
        );
    }
}

ReactDOM.render(<AppEntry/>, document.getElementById('entry'));