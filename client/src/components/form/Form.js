import React from 'react';
import cx from 'classnames';


export default class Form extends React.Component {
    static defaultProps = {
        centered: true
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.onSubmit && this.props.onSubmit(e);
    }

    render() {
        const { sm, children, centered } = this.props;
        const className = cx(
            centered && 'text-center',
            `col-md-offset-${sm ? '3' : '2'}`,
            `col-md-${sm ? '6' : '8'}`,
            `col-sm-${sm ? '6': '10'}`,
            `col-sm-offset-${sm ? '3': '1'}`,
            this.props.className
        )
        return (
            <div className={className}>
                <form className="form-horizontal" onSubmit={this.handleSubmit}>
                    {children}
                </form>
            </div>
        )
    }
}
