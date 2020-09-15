import React from 'react';

import { render } from '@testing-library/react';

import PowerModel from '../PowerModel';
import PowerWidget from '../PowerWidget';

const { engine } = global;

it('should have 1 output port', () => {
  const model = new PowerModel({
    DATA_BITS: 1,
  });

  const { container } = render(
    <PowerWidget model={model} engine={engine} />,
  );

  const port = container.querySelector('[data-name=out]');
  expect(port).toBeTruthy();
});
