import React from 'react';

import { render } from '@testing-library/react';

import XnorModel from '../XnorModel';
import XnorWidget from '../XnorWidget';

const { engine } = global;

it('should have 1 output port', () => {
  const model = new XnorModel({
    DATA_BITS: 1,
  });

  const { container } = render(
    <XnorWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name=out]');
  expect(ports).toHaveLength(1);
});

it('should have the amount of input ports determined by configuration', () => {
  const model = new XnorModel({
    INPUT_PORTS_NUMBER: 16,
    DATA_BITS: 1,
  });

  const { container } = render(
    <XnorWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name^=in]');
  expect(ports).toHaveLength(16);
});
