import React from 'react';

import { render } from '../../testUtils';
import DemuxModel from '../DemuxModel';
import DemuxWidget from '../DemuxWidget';

describe('DemuxWidget', () => {
  it('should have 1 selection and 1 input port', () => {
    const model = new DemuxModel({
      DATA_BITS: 1,
      OUTPUT_NUMBER: 16,
    });

    const { container } = render(<DemuxWidget model={model} />);

    const selection = container.querySelector(
      '[data-name=selection]',
    );
    const input = container.querySelector('[data-name=in]');

    expect(selection).toBeTruthy();
    expect(input).toBeTruthy();
  });

  it('should have the amount of output ports determined by configuration', () => {
    const model = new DemuxModel({
      DATA_BITS: 16,
      OUTPUT_NUMBER: 4,
    });

    const { container } = render(<DemuxWidget model={model} />);

    const ports = container.querySelectorAll('[data-name^=out]');
    expect(ports).toHaveLength(4);
  });
});
