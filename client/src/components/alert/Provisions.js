import React from 'react';

import styles from './Provisions.css';


export function ProvisionRow(props) {
    return (
        <div>
            <span className={styles.provisionLabel}>
                {props.label}
            </span>
            <span className={styles.provisionField}>
                {props.children}
            </span>
        </div>
    )
}

export function Provision(props) {
    let { provision } = props;
    let { provider } = provision;
    return (
        <div className={styles.provision}>
            <ProvisionRow label={"From:"}>
                { provider.name } <strong>&middot; </strong>
                { provider.phone_number} <strong>&middot; </strong>
                { provider.email }
                <br/>
                { provider.organization }
            </ProvisionRow>
            <ProvisionRow label={"Sent at:"}>
                { provision.created_at }
            </ProvisionRow>
            <ProvisionRow label={"Message:"}>
                { provision.message }
            </ProvisionRow>
        </div>
    );
}

export function Provisions(props) {
    let { provisions } = props;
    if (provisions.length === 0) {
        return null;
    }
    return (
        <div>
            { provisions.map(provision => {
                let { provider } = provision;
                return (
                    <Provision key={provision.id} provision={provision} />
                )
            })}
        </div>
    );
}
