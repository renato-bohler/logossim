import { Component } from '@logossim/core';
import widget from './OrWidget';
import model from './OrModel';
import icon from './OrIcon';

export default new Component({
  type: 'Or',
  name: 'Or',
  description: 'Logic "or" gate',
  group: 'Logic gates',
  model,
  widget,
  icon,
});
