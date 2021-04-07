import React from 'react';

import { render } from '../../testUtils';
import XorModel from '../XorModel';
import XorWidget from '../XorWidget';

describe('XorWidget', () => {
  it('should have 1 output port', () => {
    const model = new XorModel({
      DATA_BITS: 1,
    });

    const { container } = render(<XorWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=out]');
    expect(ports).toHaveLength(1);
  });

  it('should have the amount of input ports determined by configuration', () => {
    const model = new XorModel({
      INPUT_PORTS_NUMBER: 16,
      DATA_BITS: 1,
    });

    const { container } = render(<XorWidget model={model} />);

    const ports = container.querySelectorAll('[data-name^=in]');
    expect(ports).toHaveLength(16);
  });
});
