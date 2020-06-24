import { Component } from '@logossim/core';

import icon from './LedIcon';
import model from './LedModel';
import widget from './LedWidget';

export default new Component({
  type: 'Led',
  name: 'LED',
  description: 'Simple LED component',
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
      default: '#00ff00',
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
