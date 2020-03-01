import { Component } from '@logossim/core';
import widget from './ButtonWidget';
import model from './ButtonModel';
import icon from './ButtonIcon';

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
