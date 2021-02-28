import React from 'react';

import { render } from '@testing-library/react';

import ControlledBufferModel from '../ControlledBufferModel';
import ControlledBufferWidget from '../ControlledBufferWidget';

const { engine } = global;

it('should have 1 input and 1 output port', () => {
  const model = new ControlledBufferModel({
    DATA_BITS: 1,
  });

  const { container } = render(
    <ControlledBufferWidget model={model} engine={engine} />,
  );

  const input = container.querySelector('[data-name=in]');
  expect(input).toBeTruthy();

  const output = container.querySelector('[data-name=out]');
  expect(output).toBeTruthy();
});
