import React from 'react';
import PropTypes from 'prop-types';

const Line = ({ index, line }) => <div className={`line line-${index}`}>{line}</div>;
Line.propTypes = {
    index: PropTypes.number,
    line: PropTypes.array
};

export default Line;
