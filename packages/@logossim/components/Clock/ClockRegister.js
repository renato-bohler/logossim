import { Component } from '@logossim/core';
import widget from './ClockWidget';
import model from './ClockModel';
import icon from './ClockIcon';

export default new Component({
  type: 'Clock',
  name: 'Clock',
  description: 'Generates a clock signal',
  group: 'Input & output',
  configurations: [],
  model,
  widget,
  icon,
});
