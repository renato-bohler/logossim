import { Component } from '@logossim/core';

import icon from './RomIcon';
import model from './RomModel';
import widget from './RomWidget';

export default new Component({
  type: 'Rom',
  name: 'ROM',
  description: 'Read only memory',
  group: 'Memory',
  configurations: [
    {
      name: 'DATA_WIDTH',
      type: 'select',
      default: '1',
      label: 'Data width',
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
      name: 'ADDRESS_WIDTH',
      type: 'select',
      default: '1',
      label: 'Address width',
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
      ],
    },
    {
      name: 'CONTENT',
      type: 'binary',
      label: 'Initial content',
    },
  ],
  model,
  widget,
  icon,
});
