import React from 'react';

const ArrowRight = ({ size = 16, color = 'gray' }) => (
  <svg
    width={size}
    height={size}
    fill={color}
    viewBox="100 100 300 300"
  >
    <polygon
      transform="matrix(-1,0,0,1,512,0)"
      points="319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 352,128.4"
    />
  </svg>
);

export default ArrowRight;
