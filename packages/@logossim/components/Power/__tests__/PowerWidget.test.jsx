import React from 'react';

import { render } from '../../testUtils';
import PowerModel from '../PowerModel';
import PowerWidget from '../PowerWidget';

describe('PowerWidget', () => {
  it('should have 1 output port', () => {
    const model = new PowerModel({
      DATA_BITS: 1,
    });

    const { container } = render(<PowerWidget model={model} />);

    const port = container.querySelector('[data-name=out]');
    expect(port).toBeTruthy();
  });
});
