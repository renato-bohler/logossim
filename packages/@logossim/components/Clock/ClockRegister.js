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
      step: 0.25,
      min: 0.25,
      max: 1000,
      validate(value) {
        if (value < this.min)
          return `Frequency should be greater than ${this.min} Hz`;
        if (value > this.max)
          return `Frequency should be lesser than ${this.max} Hz`;
        if (value % this.step !== 0)
          return `Frequency should be divisible by ${this.step} Hz`;
        return null;
      },
    },
    {
      name: 'HIGH_DURATION',
      type: 'number',
      default: 1,
      label: 'High duration (in cycles)',
      min: 1,
      validate(value) {
        if (value < this.min)
          return `High duration should be greater than ${this.min}`;
        return null;
      },
    },
    {
      name: 'LOW_DURATION',
      type: 'number',
      default: 1,
      label: 'Low duration (in cycles)',
      min: 1,
      validate(value) {
        if (value < this.min)
          return `Low duration should be greater than ${this.min}`;
        return null;
      },
    },
  ],
  model,
  widget,
  icon,
});
