import React from 'react';

import { Shape, Pin } from './InputWidget';

const InputIcon = () => (
  <Shape dataBits={1}>
    <Pin as="div" value={0} />
  </Shape>
);

export default InputIcon;
