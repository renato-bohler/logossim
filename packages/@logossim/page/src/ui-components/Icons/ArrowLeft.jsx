import React from 'react';

const ArrowLeft = ({ size = 16, color = 'gray' }) => (
  <svg
    width={size}
    height={size}
    fill={color}
    viewBox="100 100 300 300"
  >
    <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256" />
  </svg>
);

export default ArrowLeft;
