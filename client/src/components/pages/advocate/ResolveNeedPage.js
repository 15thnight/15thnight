import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import cx from 'classnames';

import { getNeed, resolveNeed } from 'api';
import { PledgeInfo } from 'c/alert';
import Button from 'c/button';
import { Form, FormErrors, Input, InputField, StaticField, Loading } from 'c/form';
import { withRequests } from 'react-requests';

import classes from './ResolveNeedPage.css';


const NO_CHECKED_PROVISIONS_ERROR = 'select at least 1 pledge or enter Notes/Details to resolve this need.';

@withRouter
@withRequests
@connect(
    ({ need }, { params: { id, alert_id }}) => ({ id, alert_id, need: need[id] }),
    { getNeed, resolveNeed }
)
export default class ResolveNeedPage extends React.Component {
    state = {
        pledges: [],
        message: '',
        notes: '',
        errors: {}
    }

    componentWillMount() {
        const { id, alert_id } = this.props;
        this.props.getNeed({ id });
        this.props.observeRequest(resolveNeed, {
            end: () => this.props.router.push(`/view/${alert_id}`),
            error: error => this.setState({ error })
        });
    }

    handleCheckboxChange = id => {
        const pledges = this.state.pledges.includes(id)
            ? this.state.pledges.filter(pledge => pledge !== id)
            : this.state.pledges.slice().concat(id);
        this.setState({ pledges, errors: {} });
    }

    handleInputChange = (name, value) => this.setState({ [name]: value });

    handleSubmit = e => {
        const { notes, message, pledges } = this.state;
        const errors = {};
        this.setState({ errors });
        if (this.props.need.pledges.length > 0 && pledges.length === 0 && notes === '') {
            errors.pledges = errors.notes = [NO_CHECKED_PROVISIONS_ERROR];
            return this.setState({ errors });
        }
        const { id } = this.props.need;
        this.props.resolveNeed({ id, data: { notes, message, pledges } });
    }

    isChecked = ({ id }) => this.state.pledges.includes(id);

    render() {
        const { need, alert_id } = this.props;
        if (!need) {
            return <Loading title="Need" />;
        }
        let notesPlaceholder = "Notes on the resolution of this need";
        if (need.pledges.length > 0) {
            notesPlaceholder += ' (required if no pledges are selected)'
        }
        return (
            <Form onSubmit={this.handleSubmit} className={classes.resolveNeedPage}>
                <div className="text-left">
                    <Button to={`/view/${alert_id}`}>Back to View Responses</Button>
                </div>
                <h1>Resolve Need</h1>
                <h3>Need name: {need.service_name}</h3>
                <br/>
                <InputField
                  label="Notes"
                  type="textarea"
                  name="notes"
                  placeholder={notesPlaceholder}
                  value={this.state.notes}
                  onChange={this.handleInputChange}
                  errors={this.state.errors.notes}
                />
                {need.pledges.length > 0 &&
                    <div className="response">
                        <StaticField label="Pledges">
                            Select as many pledges as necessary to satisfy the youth's need
                            <FormErrors errors={this.state.errors.pledges} />
                            {need.pledges.map(pledge => (
                                <div key={pledge.id} className={cx("pledge", { selected: this.isChecked(pledge) })}>
                                    <PledgeInfo {...pledge} />
                                    <Button
                                      type="button"
                                      style={this.isChecked(pledge) ? "danger" : "success"}
                                      onClick={e => this.handleCheckboxChange(pledge.id)}
                                    >
                                        {this.isChecked(pledge) ? "Deselect" : "Select"} Pledge
                                    </Button>
                                </div>
                            ))}
                        </StaticField>
                        <InputField
                          label="Message to Selected Providers (optional)"
                          type="textarea"
                          name="message"
                          disabled={this.state.pledges.length === 0}
                          placeholder="Message that will be sent to the provider of the pledge(s) selected (optional)"
                          value={this.state.message}
                          onChange={this.handleInputChange}
                        />
                    </div>
                }
                <div className={classes.submitButton}>
                    <Button lg style="success">Submit</Button>
                </div>
            </Form>
        )
    }
}
