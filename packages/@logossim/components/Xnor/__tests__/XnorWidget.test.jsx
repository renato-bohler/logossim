import React from 'react';

import { render } from '../../testUtils';
import XnorModel from '../XnorModel';
import XnorWidget from '../XnorWidget';

describe('XnorWidget', () => {
  it('should have 1 output port', () => {
    const model = new XnorModel({
      DATA_BITS: 1,
    });

    const { container } = render(<XnorWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=out]');
    expect(ports).toHaveLength(1);
  });

  it('should have the amount of input ports determined by configuration', () => {
    const model = new XnorModel({
      INPUT_PORTS_NUMBER: 16,
      DATA_BITS: 1,
    });

    const { container } = render(<XnorWidget model={model} />);

    const ports = container.querySelectorAll('[data-name^=in]');
    expect(ports).toHaveLength(16);
  });
});
