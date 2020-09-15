import React from 'react';

import { render } from '@testing-library/react';

import GroundModel from '../GroundModel';
import GroundWidget from '../GroundWidget';

const { engine } = global;

it('should have 1 output port', () => {
  const model = new GroundModel({
    DATA_BITS: 1,
  });

  const { container } = render(
    <GroundWidget model={model} engine={engine} />,
  );

  const port = container.querySelector('[data-name=out]');
  expect(port).toBeTruthy();
});
