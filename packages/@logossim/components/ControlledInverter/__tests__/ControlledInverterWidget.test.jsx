import React from 'react';

import { render } from '@testing-library/react';

import ControlledInverterModel from '../ControlledInverterModel';
import ControlledInverterWidget from '../ControlledInverterWidget';

const { engine } = global;

it('should have 2 input and 1 output port', () => {
  const model = new ControlledInverterModel({
    DATA_BITS: 1,
  });

  const { container } = render(
    <ControlledInverterWidget model={model} engine={engine} />,
  );

  const control = container.querySelector('[data-name=control]');
  expect(control).toBeTruthy();

  const input = container.querySelector('[data-name=in]');
  expect(input).toBeTruthy();

  const output = container.querySelector('[data-name=out]');
  expect(output).toBeTruthy();
});
