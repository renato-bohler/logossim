import React from 'react';

import { render } from '../../testUtils';
import CounterModel from '../CounterModel';
import CounterWidget from '../CounterWidget';

describe('CounterWidget', () => {
  it('should have 1 input and 1 output port', () => {
    const model = new CounterModel({
      DATA_BITS: 1,
    });

    const { container } = render(<CounterWidget model={model} />);

    const input = container.querySelector('[data-name=in]');
    expect(input).toBeTruthy();

    const output = container.querySelector('[data-name=out]');
    expect(output).toBeTruthy();
  });
});
