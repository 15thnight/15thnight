import React from 'react';
import cx from 'classnames';


const getLabelClassName = (xs, sizes, alignment) => cx(
    `col-lg-${sizes.lg[0]} col-md-${sizes.md[0]} col-sm-${sizes.sm[0]} control-label`,
    `text-${alignment}`,
    {
        [`col-xs-${sizes.xs[0]}`]: xs
    }
);

const getFieldClassName = (xs, hasLabel, sizes, alignment) => cx(
    `text-${alignment}`,
    {
        [`col-lg-${sizes.lg[1]} col-md-${sizes.md[1]} col-sm-${sizes.sm[1]}`]: hasLabel,
        [`col-xs-${sizes.xs[1]}`]: xs && hasLabel,
        // If there is no label, create offsets
        [`col-lg-offset-${sizes.lg[0]} col-md-offset-${sizes.md[0]} col-sm-offset-${sizes.sm[0]}`]: !hasLabel,
        [`col-xs-offset-${sizes.xs[0]}`]: xs && !hasLabel
    }
);

const DEFAULT_SIZES = {
    xs: [4, 8],
    sm: [2, 10],
    md: [2, 10],
    lg: [4, 8]
}

const getSizes = sizes =>
    Array.isArray(sizes)
        ? { xs: sizes, sm: sizes, md: sizes, lg: sizes}
        : Object.assign({}, DEFAULT_SIZES, sizes)

export default /* FormGroup */ ({
    label,
    children,
    htmlFor,
    className,
    id,
    xs,
    noColon,
    sizes,
    labelAlignment='right',
    fieldAlignment='left'
}) => (
    <div className={cx('form-group', className)} id={id}>
        {label &&
            <label htmlFor={htmlFor} className={getLabelClassName(xs, getSizes(sizes), labelAlignment)}>
                {label}{label && !noColon && ':'}
            </label>
        }
        <div className={getFieldClassName(xs, !!label, getSizes(sizes), fieldAlignment)}>
            {children}
        </div>
    </div>
)
