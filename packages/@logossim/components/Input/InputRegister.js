import { Component } from '@logossim/core';

import icon from './InputIcon';
import model from './InputModel';
import widget from './InputWidget';

export default new Component({
  type: 'Input',
  name: 'Input pin',
  description: 'Simple input pin',
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
