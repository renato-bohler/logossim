import { Component } from '@logossim/core';

import icon from './OutputIcon';
import model from './OutputModel';
import widget from './OutputWidget';

export default new Component({
  type: 'Output',
  name: 'Output pin',
  description: 'Simple output pin',
  group: 'Input & output',
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
