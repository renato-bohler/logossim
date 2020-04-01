import { Component } from '@logossim/core';

import icon from './ButtonIcon';
import model from './ButtonModel';
import widget from './ButtonWidget';

export default new Component({
  type: 'Button',
  name: 'Button',
  description: 'Simple button',
  group: 'Input & output',
  configurations: [],
  model,
  widget,
  icon,
});
