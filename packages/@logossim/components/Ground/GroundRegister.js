import { Component } from '@logossim/core';

import icon from './GroundIcon';
import model from './GroundModel';
import widget from './GroundWidget';

export default new Component({
  type: 'Ground',
  name: 'Ground',
  description: 'Ground (GND) component',
  group: 'Wiring',
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
