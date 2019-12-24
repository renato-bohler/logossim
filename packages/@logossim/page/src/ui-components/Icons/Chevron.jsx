import React from 'react';

const Chevron = ({ size = 16, color = 'gray' }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 48 48">
    <polygon points="5,30.9 8.1,34 24,18.1 39.9,34 43,30.9 24,12" />
  </svg>
);

export default Chevron;
