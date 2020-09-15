import React from 'react';

import { render } from '@testing-library/react';

import AndModel from '../AndModel';
import AndWidget from '../AndWidget';

const { engine } = global;

it('should have 1 output port', () => {
  const model = new AndModel({
    DATA_BITS: 1,
  });

  const { container } = render(
    <AndWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name=out]');
  expect(ports).toHaveLength(1);
});

it('should have the amount of input ports determined by configuration', () => {
  const model = new AndModel({
    INPUT_PORTS_NUMBER: 16,
    DATA_BITS: 1,
  });

  const { container } = render(
    <AndWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name^=in]');
  expect(ports).toHaveLength(16);
});
