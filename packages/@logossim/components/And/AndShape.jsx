import React from 'react';

const AndShape = ({ size = 90 }) => (
  <svg
    viewBox="0 0 23.8125 23.8125"
    height={size}
    width={size}
    fill="rgba(115, 190, 255, 0.95)"
    stroke="#598897"
  >
    <g>
      <path d="M 0.26458333,0.2645835 V 11.911935 23.559286 H 11.911934 A 11.647361,11.647269 0 0 0 23.559285,11.911935 11.647361,11.647269 0 0 0 11.911934,0.2645835 Z" />
      <ellipse
        ry="15.437704"
        rx="0.03665797"
        cy="15.437704"
        cx="-0.03665797"
      />
    </g>
  </svg>
);

export default AndShape;
