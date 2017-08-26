import React from 'react';
import cx from 'classnames';

export default /* Icon */ ({ glyph, className }) => (
    <span className={cx('glyphicon', `glyphicon-${glyph}`, className)} />
)
