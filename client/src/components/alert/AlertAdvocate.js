import React from 'react';

import { ContactInfo } from 'c/user';

export default /* AlertAdvocate */ ({ advocate: { name, organization, email, phone_number } }) => (
    <div>
        {name}<br/>
        {organization}<br/>
        <ContactInfo email={email} phone_number={phone_number} />
    </div>
)
