import React from 'react';

const UploadFile = ({ size = 16, color = 'gray' }) => (
  <svg
    width={size}
    height={size}
    stroke={color}
    fill="none"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export default UploadFile;
