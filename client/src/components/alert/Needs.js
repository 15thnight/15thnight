import React from 'react';

export default function Needs(props) {
    let { needs, role } = props;
    return (
        <div>
            {needs.map(need => {
                let name = need.service.name;
                return (
                    <div key={need.id}>
                        {need.resolved ?
                            <del>{name}</del> :
                            <span>{name}</span>
                        }
                        {(role === 'provider' && need.provisions.length > 0) &&
                            <span> (responded to {need.provisions.length} time{need.provisions.length > 1 && 's'})</span>
                        }
                    </div>
                );
            })}
        </div>
    )
}