import { Component } from '@logossim/core';

import icon from './SsdIcon';
import model from './SsdModel';
import widget from './SsdWidget';

export default new Component({
  type: 'Ssd',
  name: 'SSD',
  description: 'Seven segments display',
  group: 'Input & output',
  configurations: [
    {
      name: 'ACTIVE_WHEN',
      type: 'select',
      default: 'high',
      label: 'Active when',
      options: [
        {
          label: 'High',
          value: 'high',
        },
        {
          label: 'Low',
          value: 'low',
        },
      ],
    },
    {
      name: 'ON_COLOR',
      type: 'select',
      default: '#ff0000',
      label: 'On color',
      options: [
        {
          label: 'Red',
          value: '#ff0000',
        },
        {
          label: 'Green',
          value: '#00ff00',
        },
        {
          label: 'Blue',
          value: '#0000ff',
        },
        {
          label: 'White',
          value: '#ffffff',
        },
        {
          label: 'Black',
          value: '#000000',
        },
      ],
    },
    {
      name: 'OFF_COLOR',
      type: 'select',
      default: '#000000',
      label: 'Off color',
      options: [
        {
          label: 'Red',
          value: '#ff0000',
        },
        {
          label: 'Green',
          value: '#00ff00',
        },
        {
          label: 'Blue',
          value: '#0000ff',
        },
        {
          label: 'White',
          value: '#ffffff',
        },
        {
          label: 'Black',
          value: '#000000',
        },
      ],
    },
  ],
  model,
  widget,
  icon,
});
