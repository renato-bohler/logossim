import { Component } from '@logossim/core';

import icon from './NorIcon';
import model from './NorModel';
import widget from './NorWidget';

export default new Component({
  type: 'Nor',
  name: 'Nor',
  description: 'Logic "not or" gate',
  group: 'Logic gates',
  configurations: [
    {
      name: 'INPUT_PORTS_NUMBER',
      type: 'number',
      default: 2,
      label: 'Number of input ports',
      min: 2,
      max: 32,
      validate(value) {
        if (value < this.min)
          return `Minimum input ports is ${this.min}`;
        if (value > this.max)
          return `Maximum input ports is ${this.max}`;
        return null;
      },
    },
  ],
  model,
  widget,
  icon,
});
