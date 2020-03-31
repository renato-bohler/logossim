import { Component } from '@logossim/core';

import icon from './NotIcon';
import model from './NotModel';
import widget from './NotWidget';

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
