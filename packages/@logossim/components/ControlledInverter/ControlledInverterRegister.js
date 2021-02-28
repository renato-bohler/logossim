import { Component } from '@logossim/core';

import icon from './ControlledInverterIcon';
import model from './ControlledInverterModel';
import widget from './ControlledInverterWidget';

export default new Component({
  type: 'ControlledInverter',
  name: 'Controlled inverter',
  description: 'Useful for I/O managing',
  group: 'Logic gates',
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
  ],
  model,
  widget,
  icon,
});
