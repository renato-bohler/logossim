import React from 'react';

import { render } from '@testing-library/react';

import MuxModel from '../MuxModel';
import MuxWidget from '../MuxWidget';

const { engine } = global;

it('should have 1 selection and 1 output port', () => {
  const model = new MuxModel({
    DATA_BITS: 1,
    INPUT_NUMBER: 16,
  });

  const { container } = render(
    <MuxWidget model={model} engine={engine} />,
  );

  const selection = container.querySelector('[data-name=selection]');
  const output = container.querySelector('[data-name=out]');

  expect(selection).toBeTruthy();
  expect(output).toBeTruthy();
});

it('should have the amount of input ports determined by configuration', () => {
  const model = new MuxModel({
    DATA_BITS: 16,
    INPUT_NUMBER: 4,
  });

  const { container } = render(
    <MuxWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name^=in]');
  expect(ports).toHaveLength(4);
});
