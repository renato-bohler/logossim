import React from 'react';

import { render } from '../../testUtils';
import NorModel from '../NorModel';
import NorWidget from '../NorWidget';

describe('NorWidget', () => {
  it('should have 1 output port', () => {
    const model = new NorModel({
      DATA_BITS: 1,
    });

    const { container } = render(<NorWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=out]');
    expect(ports).toHaveLength(1);
  });

  it('should have the amount of input ports determined by configuration', () => {
    const model = new NorModel({
      INPUT_PORTS_NUMBER: 16,
      DATA_BITS: 1,
    });

    const { container } = render(<NorWidget model={model} />);

    const ports = container.querySelectorAll('[data-name^=in]');
    expect(ports).toHaveLength(16);
  });
});
