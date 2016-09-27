import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';

import { getNeed, resolveNeed, clearFormStatus } from 'actions';
import { Provision } from 'alert';
import { FormErrors, Input } from 'form';

import styles from './ResolveNeedPage.css';

class ResolveNeedPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            provisionChecked: [],
            message: '',
            notes: '',
            errors: {},
            need: null
        }
    }

    componentWillMount() {
        this.props.getNeed(this.props.params.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitFormSuccess) {
            this.props.router.push('/view-responses/' + this.state.need.alert_id);
            return this.props.clearFormStatus();
        }

        if (nextProps.submitFormError) {
            this.setState({ error: nextProps.submitFormError });
            return this.props.clearFormStatus();
        }

        let need = nextProps.need[this.props.params.id];
        if (need && this.props.need[this.props.params.id] !== need) {
            this.setState({ need })
        }
    }

    handleCheckboxChange(id) {
        let {provisionChecked} = this.state;
        if (provisionChecked.indexOf(id) < 0) {
            provisionChecked.push(id);
        } else {
            provisionChecked = provisionChecked.filter(provision => provision !== id);
        }
        this.setState({provisionChecked: provisionChecked.slice(0)});
    }

    handleInputChange(name, value) {
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        let errors = {};
        let { notes, message, provisionChecked, need } = this.state;
        this.setState({ errors });
        e.preventDefault();
        if (need.provisions.length > 0 && provisionChecked.length === 0 && notes === '') {
            errors.provisions = errors.notes = ['You must select providers to notify or specify a note to resolve this need.'];
            return this.setState({ errors });
        }
        let data = { notes, message, provisions: provisionChecked }
        this.props.resolveNeed(need.id, data);
    }

    render() {
        if (!this.state.need) {
            return (<h1 className="text-center">Loading need...</h1>);
        }
        let { need } = this.state;
        return (
            <form
              onSubmit={this.handleSubmit.bind(this)}
              className="text-center col-sm-offset-3 col-sm-6">
                <div className="text-left">
                    <Link
                      to={'/view-responses/' + need.alert_id}
                      className="btn btn-primary">
                        Back to View Responses
                    </Link>
                </div>
                <h1>Resolve Need</h1>
                <h3>Need: { need.service.name }</h3>
                { need.provisions.length > 0 &&
                    <div className={styles.provisionResponse}>
                        <div className={styles.message}>
                            <div>
                               Enter an optional message that will be sent to 
                               the Providers you've selected to meet this need.
                            </div>
                            <br/>
                            <Input
                              type="textarea"
                              name="message"
                              value={this.state.message}
                              onChange={this.handleInputChange.bind(this)}/>
                        </div>
                        <br/>
                        <div>
                            Select which Provider(s) will meet the youth's need. 
                            Check a box to select a Provider. 
                            Choose as many Providers as necessary to satisfy the youth's need:
                        </div>
                        <br/>
                        <FormErrors errors={this.state.errors.provisions} />
                        <div className="text-left">
                            {need.provisions.map(provision => {
                                let { id } = provision;
                                let style = [styles.provision];
                                if (this.state.provisionChecked.indexOf(id) >= 0) {
                                    style.push(styles.provisionSelected)
                                }
                                return (
                                    <div
                                      key={id}
                                      className={style.join(' ')}
                                      onClick={this.handleCheckboxChange.bind(this, id)}
                                    >
                                        <div className={styles.provisionCheckbox}>
                                            <Input
                                                type="checkbox"
                                                name={id}
                                                checked={this.state.provisionChecked.indexOf(id) >= 0}
                                            />
                                        </div>
                                        <div className={styles.provisionInfo}>
                                            <Provision provision={provision} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                }
                <br/>
                <br/>
                <div>
                    <div>
                        <span>Enter any notes about the resolution of this need</span>
                        {
                            need.provisions.length > 0 &&
                            <span> (required if no providers are selected)</span>
                        }
                        <span>:</span>
                    </div>
                    <br/>
                    <Input
                        type="textarea"
                        name="notes"
                        value={this.state.notes}
                        onChange={this.handleInputChange.bind(this)}/>
                </div>
                <FormErrors errors={this.state.errors.notes} />
                <br/>
                <div>
                    <button className="btn btn-success">Submit</button>
                </div>
            </form>
        )
    }
}

function mapStateToProps(state) {
    return {
        need: state.need,
        submitFormSuccess: state.submitFormSuccess,
        submitFormError: state.submitFormError
    }
}

export default connect(mapStateToProps, {
    clearFormStatus,
    getNeed,
    resolveNeed
})(withRouter(ResolveNeedPage));