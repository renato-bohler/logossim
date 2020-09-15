import React from 'react';

import { render } from '@testing-library/react';

import BufferModel from '../BufferModel';
import BufferWidget from '../BufferWidget';

const { engine } = global;

it('should have 1 input and 1 output port', () => {
  const model = new BufferModel({
    DATA_BITS: 1,
  });

  const { container } = render(
    <BufferWidget model={model} engine={engine} />,
  );

  const input = container.querySelector('[data-name=in]');
  expect(input).toBeTruthy();

  const output = container.querySelector('[data-name=out]');
  expect(output).toBeTruthy();
});
