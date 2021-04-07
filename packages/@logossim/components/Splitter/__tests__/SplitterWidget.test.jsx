import React from 'react';

import { render } from '../../testUtils';
import SplitterModel from '../SplitterModel';
import SplitterWidget from '../SplitterWidget';

describe('SplitterWidget', () => {
  it('should have 1 input port', () => {
    const model = new SplitterModel({
      DATA_BITS: 16,
    });

    const { container } = render(<SplitterWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=in]');
    expect(ports).toHaveLength(1);
  });

  it('should have the amount of output ports determined by configuration', () => {
    const model = new SplitterModel({
      DATA_BITS: 16,
    });

    const { container } = render(<SplitterWidget model={model} />);

    const ports = container.querySelectorAll('[data-name^=out]');
    expect(ports).toHaveLength(16);
  });
});
