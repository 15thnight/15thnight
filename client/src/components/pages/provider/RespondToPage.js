import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

// import { InputField, FormField } from 'form'
import {
    getAlert, sendResponse, clearFormStatus
} from 'actions'

class RespondToPage extends React.Component {

    constructor (props) {
      super(props)
      this.state = {
            alert: null,
            message: '',
            error: { }
        }
    }

    componentWillMount () {
        this.props.getAlert(this.props.params.id)
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.clearFormStatus()
            return this.props.router.push('/')
        }
        if (nextProps.alert[this.props.params.id]) {
            this.setState({
                alert: nextProps.alert[this.props.params.id]
            })
        }
    }

    handleInputChange (name, e) {
        this.setState({ [name]: e.target.value })
    }

    handleSubmit (e) {
        e.preventDefault()
        this.setState({ error: {} })
        this.props.sendResponse({
            alert_id: this.props.params.id,
            message: this.state.message
        })
    }

    handleRespond (e) {
    }

    renderErrors (errors) {
        if (!errors || errors.length === 0) {
          return null
        }
        return (
            <div className="row">
                {errors.map((error, key) => {
                    return (<div key={key} className="error">{error}</div>)
                })}
            </div>
        )
    }

    render () {
        if (!this.state.alert) {
          return (<h1 className="text-center">Loading Alert...</h1>)
        }
        let { alert } = this.state
        let needs = alert.needs.map(need => needRow(need))
        return (
            <div className="text-center col-sm-offset-3 col-sm-6">
                <h2>Alert</h2>
                <h3>Date/Time: {alert.created_at}</h3>
                <h3>Age: {alert.age}</h3>
                <h3>Gender: {alert.gender}</h3>
                <h3>Message: {alert.description}</h3>
                <h3>Needs:</h3>
                {needs}
            </div>
        )
    }
}

function needRow (need) {
    let needId = 'need_' + need.id
    return (
        <div id={needId}>
            <h3>{need.name}</h3>
            <button className="btn btn-xs btn-primary" type="submit">Respond</button>
        </div>
    )
}

function mapStateToProps (state) {
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
})(withRouter(RespondToPage))
