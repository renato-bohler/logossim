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
      ],
    },
    {
      name: 'THREE_STATE',
      type: 'select',
      default: 'false',
      label: 'Three state',
      options: [
        {
          label: 'Yes',
          value: 'true',
        },
        {
          label: 'No',
          value: 'false',
        },
      ],
    },
  ],
  model,
  widget,
  icon,
});
