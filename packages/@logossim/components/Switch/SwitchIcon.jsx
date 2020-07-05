import React from 'react';

import { Shape, Switch, SwitchValue } from './SwitchWidget';

const SwitchIcon = () => (
  <Shape>
    <Switch as="div">
      <SwitchValue value={0} />
    </Switch>
  </Shape>
);

export default SwitchIcon;
