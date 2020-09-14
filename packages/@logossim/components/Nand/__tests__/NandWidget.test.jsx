import React from 'react';

import { render } from '@testing-library/react';

import NandModel from '../NandModel';
import NandWidget from '../NandWidget';

const { engine } = global;

it('should have 1 output port', () => {
  const model = new NandModel({
    DATA_BITS: 1,
  });

  const { container } = render(
    <NandWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name=out]');
  expect(ports).toHaveLength(1);
});

it('should have the amount of input ports determined by configuration', () => {
  const model = new NandModel({
    INPUT_PORTS_NUMBER: 16,
    DATA_BITS: 1,
  });

  const { container } = render(
    <NandWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name^=in]');
  expect(ports).toHaveLength(16);
});
