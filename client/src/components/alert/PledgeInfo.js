import React from 'react';

import { StaticField } from 'c/form';
import Timestamp from 'c/timestamp';
import { ContactInfo } from 'c/user';


const FIELD_SIZES = { xs: [4, 8], sm: [3, 9], lg: [3, 9] };

export default /* PledgeInfo */ ({ provider, message, created_at, noProvider }) => (
    <div>
        {!noProvider &&
            <StaticField label="From" xs sizes={FIELD_SIZES}>
                <div>{provider.name}</div>
                <ContactInfo email={provider.email} phone_number={provider.phone_number} />
                <div>{provider.organization}</div>
            </StaticField>
        }
        <StaticField label="Sent" xs sizes={FIELD_SIZES}>
            <Timestamp time={created_at} />
        </StaticField>
        <StaticField label="Message" xs sizes={FIELD_SIZES}>{message}</StaticField>
    </div>
)
