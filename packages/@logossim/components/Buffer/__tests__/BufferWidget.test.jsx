import React from 'react';

import { render } from '../../testUtils';
import BufferModel from '../BufferModel';
import BufferWidget from '../BufferWidget';

describe('BufferWidget', () => {
  it('should have 1 input and 1 output port', () => {
    const model = new BufferModel({
      DATA_BITS: 1,
    });

    const { container } = render(<BufferWidget model={model} />);

    const input = container.querySelector('[data-name=in]');
    expect(input).toBeTruthy();

    const output = container.querySelector('[data-name=out]');
    expect(output).toBeTruthy();
  });
});
