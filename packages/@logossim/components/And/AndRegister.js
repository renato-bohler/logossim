import { Component } from '@logossim/core';
import widget from './AndWidget';
import model from './AndModel';
import icon from './AndIcon';

export default new Component({
  type: 'And',
  name: 'And',
  description: 'Logic "and" gate',
  group: 'Logic gates',
  configurations: [
    {
      name: 'INPUT_PORTS_NUMBER',
      type: 'select',
      default: '2',
      label: 'Number of input ports',
      options: [
        {
          label: 'Two',
          value: '2',
        },
        {
          label: 'Three',
          value: '3',
        },
        {
          label: 'Five',
          value: '5',
        },
      ],
    },
  ],
  model,
  widget,
  icon,
});
