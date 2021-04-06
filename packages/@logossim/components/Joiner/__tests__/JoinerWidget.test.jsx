import React from 'react';

import { render } from '../../testUtils';
import JoinerModel from '../JoinerModel';
import JoinerWidget from '../JoinerWidget';

describe('JoinerWidget', () => {
  it('should have 1 output port', () => {
    const model = new JoinerModel({
      DATA_BITS: 16,
    });

    const { container } = render(<JoinerWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=out]');
    expect(ports).toHaveLength(1);
  });

  it('should have the amount of input ports determined by configuration', () => {
    const model = new JoinerModel({
      DATA_BITS: 16,
    });

    const { container } = render(<JoinerWidget model={model} />);

    const ports = container.querySelectorAll('[data-name^=in]');
    expect(ports).toHaveLength(16);
  });
});
