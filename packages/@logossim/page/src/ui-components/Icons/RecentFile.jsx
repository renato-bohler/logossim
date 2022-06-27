import React from 'react';

const RecentFile = ({ size = 16, color = 'gray' }) => (
  <svg
    width={size}
    height={size}
    stroke={color}
    fill="none"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default RecentFile;
