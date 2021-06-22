import React from 'react';

import { render } from '../../testUtils';
import ClockModel from '../ClockModel';
import ClockWidget from '../ClockWidget';

describe('ClockWidget', () => {
  it('should have 1 output port', () => {
    const model = new ClockModel('Clock', {
      FREQUENCY_HZ: 1,
      HIGH_DURATION: 1,
      LOW_DURATION: 1,
    });

    const { container } = render(<ClockWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=out]');
    expect(ports).toHaveLength(1);
  });

  it('should display off value', () => {
    const model = new ClockModel('Clock', {
      FREQUENCY_HZ: 1,
      HIGH_DURATION: 1,
      LOW_DURATION: 1,
    });
    model.getPort('out').setValue([0]);

    const { getByTestId } = render(<ClockWidget model={model} />);
    const decoration = getByTestId('decoration');

    expect(decoration).toHaveStyle('transform: scaleX(-1)');
  });

  it('should display on value', () => {
    const model = new ClockModel('Clock', {
      FREQUENCY_HZ: 1,
      HIGH_DURATION: 1,
      LOW_DURATION: 1,
    });
    model.getPort('out').setValue([1]);

    const { getByTestId } = render(<ClockWidget model={model} />);
    const decoration = getByTestId('decoration');

    expect(decoration).toHaveStyle('transform: scaleX(1)');
  });
});
