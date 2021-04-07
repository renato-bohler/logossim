import { Component } from '@logossim/core';
import { MAX_VALUE } from '@logossim/core/Simulation/utils';

import icon from './CounterIcon';
import model from './CounterModel';
import widget from './CounterWidget';

export default new Component({
  type: 'Counter',
  name: 'Counter',
  description: 'Counts every input rising or falling edge',
  group: 'Miscellaneous',
  configurations: [
    {
      name: 'DATA_BITS',
      type: 'select',
      default: '1',
      label: 'Data bits',
      options: [
        {
          label: '1 bit',
          value: '1',
        },
        {
          label: '2 bits',
          value: '2',
        },
        {
          label: '4 bits',
          value: '4',
        },
        {
          label: '8 bits',
          value: '8',
        },
        {
          label: '16 bits',
          value: '16',
        },
      ],
    },
    {
      name: 'COUNT_ON',
      type: 'select',
      default: 'rising',
      label: 'Count on',
      options: [
        {
          label: 'Rising edge',
          value: 'rising',
        },
        {
          label: 'Falling edge',
          value: 'falling',
        },
      ],
    },
    {
      name: 'START_AT',
      type: 'number',
      default: 0,
      label: 'Start value at',
      min: 0,
      max: MAX_VALUE[16],
      validate(value, configurations) {
        const DATA_BITS = Number(configurations.DATA_BITS);

        if (value > MAX_VALUE[DATA_BITS])
          return `Maximum value for ${DATA_BITS}-bit is ${MAX_VALUE[DATA_BITS]}`;

        return null;
      },
    },
    {
      name: 'WRAP_AT',
      type: 'number',
      default: 0,
      label: 'Wrap value at (0 means no wrap)',
      min: 0,
      max: MAX_VALUE[16],
      validate(value, configurations) {
        const DATA_BITS = Number(configurations.DATA_BITS);
        const START_AT = Number(configurations.START_AT);

        if (value > MAX_VALUE[DATA_BITS])
          return `Maximum value for ${DATA_BITS}-bit is ${MAX_VALUE[DATA_BITS]}`;

        if (value !== 0 && value <= START_AT)
          return `Value must be greater than ${START_AT} (start value)`;

        return null;
      },
    },
    {
      name: 'STEP_VALUE',
      type: 'number',
      default: 1,
      label: 'Step value',
      min: 1,
      max: MAX_VALUE[16],
      validate(value, configurations) {
        const DATA_BITS = Number(configurations.DATA_BITS);

        if (value > MAX_VALUE[DATA_BITS])
          return `Maximum value for ${DATA_BITS}-bit is ${MAX_VALUE[DATA_BITS]}`;

        return null;
      },
    },
  ],
  model,
  widget,
  icon,
});
