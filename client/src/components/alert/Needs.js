import React from 'react';

import classes from './Needs.css';

export default /* Needs */ ({ needs, role, withLink }) => (
    <ol className={classes.needs}>
        {needs.map(({ id, resolved, pledges, service_name }) => (
            <li key={id}>
                {withLink &&
                    <a href={`#need${id}`}>
                        {resolved ? <del>{service_name}</del> : <span>{service_name}</span>}
                    </a>
                }
                {!withLink && (resolved ? <del>{service_name}</del> : <span>{service_name}</span>)}
                {role === 'provider' && pledges.length > 0 &&
                    <span> (responded to {pledges.length} time{pledges.length > 1 && 's'})</span>
                }
            </li>
        ))}
    </ol>
);
