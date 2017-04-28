import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';

import { getNeed, resolveNeed } from 'api';
import { Provision } from 'alert';
import { FormErrors, Input } from 'form';
import { checkRequest } from 'util';

import styles from './ResolveNeedPage.css';

class ResolveNeedPage extends React.Component {
    state = {
        provisionChecked: [],
        message: '',
        notes: '',
        errors: {}
    }

    componentWillMount() {
        this.props.getNeed(this.props.params.id);
    }

    componentWillReceiveProps({ request, need }) {
        checkRequest(this.props.request, request, resolveNeed,
            () => this.props.router.push(`/view-responses/${this.props.need.alert_id}`),
            error => this.setState({ error })
        );
    }

    handleCheckboxChange = id => {
        const provisionChecked = this.state.provisionChecked.includes(id) ?
            this.state.provisionChecked.slice().concat(id) :
            this.state.provisionChecked.filter(provision => provision !== id);
        this.setState({ provisionChecked });
    }

    handleInputChange = (name, value) => this.setState({ [name]: value });

    handleSubmit = e => {
        const { id, provisions } = this.props.need;
        const { notes, message, provisionChecked } = this.state;
        this.setState({ errors: {} });
        e.preventDefault();
        if (provisions.length > 0 && provisionChecked.length === 0 && notes === '') {
            const error = ['You must select providers to notify or specify a note to resolve this need.'];
            return this.setState({
                provisions: error,
                notes: error
            })
        }
        this.props.resolveNeed(id, { notes, message, provisions: provisionChecked });
    }

    render() {
        const { need } = this.props;
        if (!need) {
            return (<h1 className="text-center">Loading need...</h1>);
        }
        return (
            <form
              onSubmit={this.handleSubmit}
              className="text-center col-md-offset-3 col-md-6">
                <div className="text-left">
                    <Link
                      to={'/view-responses/' + need.alert_id}
                      className="btn btn-primary">
                        Back to View Responses
                    </Link>
                </div>
                <h1>Resolve Need</h1>
                <h3>Need: { need.service.name }</h3>
                {need.provisions.length > 0 &&
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
                              onChange={this.handleInputChange}/>
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
                        {need.provisions.length > 0 &&
                            <span> (required if no providers are selected)</span>
                        }
                        <span>:</span>
                    </div>
                    <br/>
                    <Input
                      type="textarea"
                      name="notes"
                      value={this.state.notes}
                      onChange={this.handleInputChange}
                    />
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

const mapStateToProps = ({ request, need }, { params: { id }}) =>
    ({ request, need: need[id] });

export default connect(mapStateToProps, {
    getNeed,
    resolveNeed
})(withRouter(ResolveNeedPage));
