import React from 'react';
import PropTypes from 'prop-types';

const Block = ({ index, active, incative }) => (
    <div
        className={
            `block 
            block-${index} 
            ${active ? 'filled' : ''}
            ${incative ? 'inactive' : ''}
        `
        }></div>
);

Block.propTypes = {
    index: PropTypes.number,
    active: PropTypes.bool,
    incative: PropTypes.bool
};

export default Block;
