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
      label: 'Number of input ports',
      options: [
        {
          label: 'One',
          value: 1,
        },
        {
          label: 'Two',
          value: 2,
        },
        {
          label: 'Three',
          value: 3,
        },
        {
          label: 'Four',
          value: 4,
        },
      ],
    },
  ],
  model,
  widget,
  icon,
});
