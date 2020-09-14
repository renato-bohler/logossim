import React from 'react';

import { render } from '@testing-library/react';

import NorModel from '../NorModel';
import NorWidget from '../NorWidget';

const { engine } = global;

it('should have 1 output port', () => {
  const model = new NorModel({
    DATA_BITS: 1,
  });

  const { container } = render(
    <NorWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name=out]');
  expect(ports).toHaveLength(1);
});

it('should have the amount of input ports determined by configuration', () => {
  const model = new NorModel({
    INPUT_PORTS_NUMBER: 16,
    DATA_BITS: 1,
  });

  const { container } = render(
    <NorWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name^=in]');
  expect(ports).toHaveLength(16);
});
