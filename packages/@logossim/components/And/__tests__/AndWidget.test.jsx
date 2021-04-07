import React from 'react';

import { render } from '../../testUtils';
import AndModel from '../AndModel';
import AndWidget from '../AndWidget';

describe('AndWidget', () => {
  it('should have 1 output port', () => {
    const model = new AndModel({
      DATA_BITS: 1,
    });

    const { container } = render(<AndWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=out]');
    expect(ports).toHaveLength(1);
  });

  it('should have the amount of input ports determined by configuration', () => {
    const model = new AndModel({
      INPUT_PORTS_NUMBER: 16,
      DATA_BITS: 1,
    });

    const { container } = render(<AndWidget model={model} />);

    const ports = container.querySelectorAll('[data-name^=in]');
    expect(ports).toHaveLength(16);
  });
});
