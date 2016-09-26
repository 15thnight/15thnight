import React from 'react';

import styles from './AlertInfo.css';


function AlertInfoRow(props) {
    return (
        <h3>
            <span className={ styles.alertInfoLabel }>{ props.label }: </span>
            <span>{ props.children }</span>
        </h3>
    )
}

function AlertInfo(props) {
    let { alert } = props;
    let needs = alert.needs.map((need, key) => {
        return (
            <div key={ need.id } className={ styles.need }>
                <a href={"#need" + key}>
                    { need.resolved ? <del>{ need.service.name }</del> : <span>{ need.service.name }</span> }
                </a>
            </div>
        );
    });
    return (
        <div className={ styles.alertInfo }>
            <AlertInfoRow label={"Needs"}>
                <div className={ styles.needList }>
                    { needs }
                </div>
            </AlertInfoRow>
            <AlertInfoRow label={"Sent at"}>
                { alert.created_at }
            </AlertInfoRow>
            <AlertInfoRow label={"Age"}>
                { alert.age }
            </AlertInfoRow>
            <AlertInfoRow label={"Gender"}>
                { alert.gender }
            </AlertInfoRow>
            <AlertInfoRow label={"Message"}>
                { alert.description }
            </AlertInfoRow>
        </div>
    );
}

export default AlertInfo;