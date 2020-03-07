import React from 'react';

const Play = ({ size = 16, color = '#008000' }) => (
  <svg width={size} height={size} fill={color} viewBox="0 0 512 512">
    <path d="M60.54,512c-17.06,0-30.43-13.86-30.43-31.56V31.55C30.12,13.86,43.48,0,60.55,0A32.94,32.94,0,0,1,77,4.52L465.7,229c10.13,5.85,16.18,16,16.18,27s-6,21.2-16.18,27L77,507.48A32.92,32.92,0,0,1,60.55,512Z" />
  </svg>
);

export default Play;
