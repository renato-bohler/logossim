import React from 'react';

import { render } from '../../testUtils';
import InputModel from '../InputModel';
import InputWidget from '../InputWidget';

describe('InputWidget', () => {
  it('should have 1 output port', () => {
    const model = new InputModel({ DATA_BITS: 1 });

    const { container } = render(<InputWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=out]');
    expect(ports).toHaveLength(1);
  });

  it('should have 1 pin when configured with 1-bit', () => {
    const model = new InputModel({ DATA_BITS: 1 });

    const { getByRole } = render(<InputWidget model={model} />);

    const pins = getByRole('button');
    expect(pins).toBeInTheDocument();
  });

  it('should have 2 pins when configured with 2-bits', () => {
    const model = new InputModel({ DATA_BITS: 2 });

    const { getAllByRole } = render(<InputWidget model={model} />);

    const pins = getAllByRole('button');
    expect(pins).toHaveLength(2);
  });

  it('should have 4 pins when configured with 4-bits', () => {
    const model = new InputModel({ DATA_BITS: 4 });

    const { getAllByRole } = render(<InputWidget model={model} />);
    const pins = getAllByRole('button');

    expect(pins).toHaveLength(4);
  });

  it('should have 8 pins when configured with 8-bits', () => {
    const model = new InputModel({ DATA_BITS: 8 });

    const { getAllByRole } = render(<InputWidget model={model} />);
    const pins = getAllByRole('button');

    expect(pins).toHaveLength(8);
  });

  it('should have 16 pins when configured with 16-bits', () => {
    const model = new InputModel({ DATA_BITS: 16 });

    const { getAllByRole } = render(<InputWidget model={model} />);
    const pins = getAllByRole('button');

    expect(pins).toHaveLength(16);
  });

  it('should display pin values accordingly', () => {
    const DATA_BITS = 16;

    const model = new InputModel({ DATA_BITS });
    const spy = jest.spyOn(model, 'getOutput');
    spy.mockImplementation(() =>
      (0b1010_1010_1010_1010).asArray(DATA_BITS),
    );

    const { getAllByRole } = render(<InputWidget model={model} />);
    const pins = getAllByRole('button');

    pins.forEach((pin, i) => {
      expect(pin).toContainHTML(i % 2 ? '0' : '1');
    });
  });

  it('should display floating and errored values correctly', () => {
    const model = new InputModel({ DATA_BITS: 2 });
    const spy = jest.spyOn(model, 'getOutput');
    spy.mockImplementation(() => ['x', 'e']);

    const { getAllByRole } = render(<InputWidget model={model} />);
    const pins = getAllByRole('button');

    pins.forEach((pin, i) => {
      expect(pin).toContainHTML(i % 2 ? 'e' : 'x');
    });
  });

  it('should call model onClick when a pin is clicked', () => {
    const model = new InputModel({ DATA_BITS: 16 });
    const spy = jest.spyOn(model, 'onClick');
    spy.mockImplementation(() => {});

    const { getAllByRole } = render(<InputWidget model={model} />);
    const pins = getAllByRole('button');

    pins.forEach((pin, i) => {
      pin.click();
      expect(spy).toHaveBeenNthCalledWith(i + 1, i);
    });
  });
});
