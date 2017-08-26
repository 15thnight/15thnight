import React from 'react';


export default /* ContactInfo */ ({ email, phone_number }) => (
    <div>
        <div><a href={`mailto:${email}`}>{email}</a></div>
        <div>{phone_number.substr(0, 3)}-{phone_number.substr(3, 3)}-{phone_number.substr(6, 4)}</div>
    </div>
);
