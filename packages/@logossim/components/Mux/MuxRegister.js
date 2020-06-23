import { Component } from '@logossim/core';

import icon from './MuxIcon';
import model from './MuxModel';
import widget from './MuxWidget';

export default new Component({
  type: 'Mux',
  name: 'Mux',
  description: 'Multiplexer',
  group: 'Plexers',
  configurations: [
    {
      name: 'DATA_BITS',
      type: 'select',
      default: '1',
      label: 'Data bits',
      options: [
        {
          label: '1 bits',
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
      name: 'INPUT_NUMBER',
      type: 'select',
      default: '2',
      label: 'Number of inputs',
      options: [
        {
          label: '2',
          value: '2',
        },
        {
          label: '4',
          value: '4',
        },
        {
          label: '16',
          value: '16',
        },
      ],
    },
  ],
  model,
  widget,
  icon,
});
