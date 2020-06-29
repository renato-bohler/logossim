import { Component } from '@logossim/core';

import icon from './PowerIcon';
import model from './PowerModel';
import widget from './PowerWidget';

export default new Component({
  type: 'Power',
  name: 'Power',
  description: 'Power (VCC) component',
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
