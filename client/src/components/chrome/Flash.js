import React from 'react';
import { connect } from 'react-redux';

import { clearFlash } from 'actions';

class Flash extends React.Component {

    handleHideFlash(id) {
        this.props.clearFlash(id);
    }

    render() {
        return (
            <div>
                {this.props.flash.map(flash => {
                    return (
                        <div onClick={() => this.handleHideFlash(flash.id)} key={flash.id} className={"alert alert-dismissible alert-" + flash.type}>
                            <button className="close">&times;</button>
                            <span>{ flash.message }</span>
                        </div>
                    );
                })}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        flash: state.flash
    }
}

export default connect(mapStateToProps, {
    clearFlash
})(Flash);