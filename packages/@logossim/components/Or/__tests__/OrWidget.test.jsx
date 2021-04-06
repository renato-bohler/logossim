import React from 'react';

import { render } from '../../testUtils';
import OrModel from '../OrModel';
import OrWidget from '../OrWidget';

describe('OrWidget', () => {
  it('should have 1 output port', () => {
    const model = new OrModel({
      DATA_BITS: 1,
    });

    const { container } = render(<OrWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=out]');
    expect(ports).toHaveLength(1);
  });

  it('should have the amount of input ports determined by configuration', () => {
    const model = new OrModel({
      INPUT_PORTS_NUMBER: 16,
      DATA_BITS: 1,
    });

    const { container } = render(<OrWidget model={model} />);

    const ports = container.querySelectorAll('[data-name^=in]');
    expect(ports).toHaveLength(16);
  });
});
