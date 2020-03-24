import { Component } from '@logossim/core';
import widget from './ClockWidget';
import model from './ClockModel';
import icon from './ClockIcon';

export default new Component({
  type: 'Clock',
  name: 'Clock',
  description: 'Generates a clock signal',
  group: 'Input & output',
  configurations: [
    {
      name: 'FREQUENCY_HZ',
      type: 'number',
      default: 1,
      label: 'Frequency (in Hz)',
      min: 1,
      max: 1000,
      validate(frequency) {
        if (frequency < this.min)
          return `Frequency should be greater than ${this.min} Hz`;
        if (frequency > this.max)
          return `Frequency should be lesser than ${this.max} Hz`;
        return null;
      },
    },
  ],
  model,
  widget,
  icon,
});
