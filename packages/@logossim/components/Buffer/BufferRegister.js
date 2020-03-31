import { Component } from '@logossim/core';

import icon from './BufferIcon';
import model from './BufferModel';
import widget from './BufferWidget';

export default new Component({
  type: 'Buffer',
  name: 'Buffer',
  description: 'Simple buffer',
  group: 'Logic gates',
  configurations: [],
  model,
  widget,
  icon,
});
