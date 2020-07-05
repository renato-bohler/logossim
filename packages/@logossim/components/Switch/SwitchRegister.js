import { Component } from '@logossim/core';

import icon from './SwitchIcon';
import model from './SwitchModel';
import widget from './SwitchWidget';

export default new Component({
  type: 'Switch',
  name: 'Switch',
  description: 'On/off switch',
  group: 'Input & output',
  configurations: [],
  model,
  widget,
  icon,
});
