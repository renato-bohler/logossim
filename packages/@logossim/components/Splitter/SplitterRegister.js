import { Component } from '@logossim/core';

import icon from './SplitterIcon';
import model from './SplitterModel';
import widget from './SplitterWidget';

export default new Component({
  type: 'Splitter',
  name: 'Splitter',
  description: 'Split wire with N bits into N 1 bit wires',
  group: 'Wiring',
  configurations: [
    {
      name: 'DATA_BITS',
      type: 'select',
      default: '2',
      label: 'Input data bits',
      options: [
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
