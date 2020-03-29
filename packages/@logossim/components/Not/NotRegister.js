import { Component } from '@logossim/core';
import widget from './NotWidget';
import model from './NotModel';
import icon from './NotIcon';

export default new Component({
  type: 'Not',
  name: 'Not',
  description: 'Negation component',
  group: 'Logic gates',
  configurations: [],
  model,
  widget,
  icon,
});
