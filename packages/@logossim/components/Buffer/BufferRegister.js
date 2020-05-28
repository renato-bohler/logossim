import { Component } from '@logossim/core';

import icon from './BufferIcon';
import model from './BufferModel';
import widget from './BufferWidget';

export default new Component({
  type: 'Buffer',
  name: 'Buffer',
  description: 'Simple buffer',
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
        {
          label: '32 bits',
          value: '32',
        },
      ],
    },
  ],
  model,
  widget,
  icon,
});
