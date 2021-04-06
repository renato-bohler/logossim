import React from 'react';

import { render } from '../../testUtils';
import LedModel from '../LedModel';
import LedWidget from '../LedWidget';

describe('LedWidget', () => {
  it('should have 1 input port', () => {
    const model = new LedModel();

    const { container } = render(<LedWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=in]');
    expect(ports).toHaveLength(1);
  });

  it('should display correct color when configured with active on high and value is low', () => {
    const model = new LedModel({
      ACTIVE_WHEN: 'HIGH',
      ON_COLOR: '#ff0000',
      OFF_COLOR: '#000000',
    });
    const spy = jest.spyOn(model, 'getInput');
    spy.mockImplementation(() => 0);

    const { getByTestId } = render(<LedWidget model={model} />);
    const shape = getByTestId('shape');

    expect(shape).toHaveAttribute('color', '#000000');
  });

  it('should display correct color when configured with active on high and value is high', () => {
    const model = new LedModel({
      ACTIVE_WHEN: 'HIGH',
      ON_COLOR: '#ff0000',
      OFF_COLOR: '#000000',
    });
    const spy = jest.spyOn(model, 'getInput');
    spy.mockImplementation(() => 1);

    const { getByTestId } = render(<LedWidget model={model} />);
    const shape = getByTestId('shape');

    expect(shape).toHaveAttribute('color', '#ff0000');
  });

  it('should display correct color when configured with active on low and value is low', () => {
    const model = new LedModel({
      ACTIVE_WHEN: 'LOW',
      ON_COLOR: '#ff0000',
      OFF_COLOR: '#000000',
    });
    const spy = jest.spyOn(model, 'getInput');
    spy.mockImplementation(() => 0);

    const { getByTestId } = render(<LedWidget model={model} />);
    const shape = getByTestId('shape');

    expect(shape).toHaveAttribute('color', '#ff0000');
  });

  it('should display correct color when configured with active on low and value is high', () => {
    const model = new LedModel({
      ACTIVE_WHEN: 'LOW',
      ON_COLOR: '#ff0000',
      OFF_COLOR: '#000000',
    });
    const spy = jest.spyOn(model, 'getInput');
    spy.mockImplementation(() => 1);

    const { getByTestId } = render(<LedWidget model={model} />);
    const shape = getByTestId('shape');

    expect(shape).toHaveAttribute('color', '#000000');
  });
});
