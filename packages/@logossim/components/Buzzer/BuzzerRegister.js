import { Component } from '@logossim/core';

import icon from './BuzzerIcon';
import model from './BuzzerModel';
import widget from './BuzzerWidget';

export default new Component({
  type: 'Buzzer',
  name: 'Buzzer',
  description: 'Outputs sound at a give frequency',
  group: 'Input & output',
  configurations: [
    {
      name: 'FREQUENCY_HZ',
      type: 'number',
      default: 300,
      label: 'Sound frequency (in Hertz)',
      min: 0,
      max: 20000,
      validate(value) {
        if (value < this.min)
          return `Minimum frequency is ${this.min} Hz`;
        if (value > this.max)
          return `Maximum frequency is ${this.max} Hz`;
        return null;
      },
    },
    {
      name: 'WAVEFORM',
      type: 'select',
      default: 'SINE',
      label: 'Waveform',
      options: [
        {
          label: 'Sine',
          value: 'SINE',
        },
        {
          label: 'Square',
          value: 'SQUARE',
        },
        {
          label: 'Sawtooth',
          value: 'SAWTOOTH',
        },
        {
          label: 'Triangle',
          value: 'TRIANGLE',
        },
      ],
    },
  ],
  model,
  widget,
  icon,
});
