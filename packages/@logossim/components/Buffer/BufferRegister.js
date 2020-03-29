import { Component } from '@logossim/core';
import widget from './BufferWidget';
import model from './BufferModel';
import icon from './BufferIcon';

export default new Component({
  type: 'Buffer',
  name: 'Buffer',
  description: 'Simple buffer',
  group: 'Input & output',
  configurations: [],
  model,
  widget,
  icon,
});
