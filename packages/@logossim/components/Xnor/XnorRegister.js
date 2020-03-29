import { Component } from '@logossim/core';
import widget from './XnorWidget';
import model from './XnorModel';
import icon from './XnorIcon';

export default new Component({
  type: 'Xnor',
  name: 'Xnor',
  description: 'Logic "not exclusive or" gate',
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
    {
      name: 'MULTIPLE_INPUT_BEHAVIOR',
      type: 'select',
      default: 'ONE',
      label: 'Multiple input behavior',
      options: [
        {
          label: 'Detect when only one input is on',
          value: 'ONE',
        },
        {
          label: 'Detect when an odd number of inputs are on',
          value: 'ODD',
        },
      ],
    },
  ],
  model,
  widget,
  icon,
});
