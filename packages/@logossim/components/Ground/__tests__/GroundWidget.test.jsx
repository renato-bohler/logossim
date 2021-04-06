import React from 'react';

import { render } from '../../testUtils';
import GroundModel from '../GroundModel';
import GroundWidget from '../GroundWidget';

describe('GroundWidget', () => {
  it('should have 1 output port', () => {
    const model = new GroundModel({
      DATA_BITS: 1,
    });

    const { container } = render(<GroundWidget model={model} />);

    const port = container.querySelector('[data-name=out]');
    expect(port).toBeTruthy();
  });
});
