import React from 'react';

import { Shape, Pin } from './OutputWidget';

const OutputIcon = () => (
  <Shape dataBits={1} outputType="BITS">
    <Pin as="div" value={0} />
  </Shape>
);

export default OutputIcon;
