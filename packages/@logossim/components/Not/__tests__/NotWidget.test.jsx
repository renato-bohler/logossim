import React from 'react';

import { render } from '@testing-library/react';

import NotModel from '../NotModel';
import NotWidget from '../NotWidget';

const { engine } = global;

it('should have 1 input and 1 output port', () => {
  const model = new NotModel({
    DATA_BITS: 1,
  });

  const { container } = render(
    <NotWidget model={model} engine={engine} />,
  );

  const input = container.querySelector('[data-name=in]');
  expect(input).toBeTruthy();

  const output = container.querySelector('[data-name=out]');
  expect(output).toBeTruthy();
});
