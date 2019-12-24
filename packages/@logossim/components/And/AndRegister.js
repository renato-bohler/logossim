import { Component } from '@logossim/core';
import widget from './AndWidget';
import model from './AndModel';
import icon from './AndIcon';

export default new Component({
  type: 'And',
  name: 'And',
  description: 'Logic and gate',
  group: 'Logic gates',
  model,
  widget,
  icon,
});
