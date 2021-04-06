import React from 'react';

import { render } from '../../testUtils';
import OutputModel from '../OutputModel';
import OutputWidget from '../OutputWidget';

describe('OutputWidget', () => {
  it('should have 1 input port', () => {
    const model = new OutputModel({ DATA_BITS: 1 });

    const { container } = render(<OutputWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=in]');
    expect(ports).toHaveLength(1);
  });

  it('should have 1 pin when configured with 1-bit', () => {
    const model = new OutputModel({
      DATA_BITS: 1,
      OUTPUT_FORMAT: 'BITS',
    });

    const { getByTestId } = render(<OutputWidget model={model} />);

    const pinContainer = getByTestId('pin-container');
    expect(pinContainer.children).toHaveLength(1);
  });

  it('should have 2 pins when configured with 2-bit', () => {
    const model = new OutputModel({
      DATA_BITS: 2,
      OUTPUT_FORMAT: 'BITS',
    });

    const { getByTestId } = render(<OutputWidget model={model} />);

    const pinContainer = getByTestId('pin-container');
    expect(pinContainer.children).toHaveLength(2);
  });

  it('should have 4 pins when configured with 4-bit', () => {
    const model = new OutputModel({
      DATA_BITS: 4,
      OUTPUT_FORMAT: 'BITS',
    });

    const { getByTestId } = render(<OutputWidget model={model} />);

    const pinContainer = getByTestId('pin-container');
    expect(pinContainer.children).toHaveLength(4);
  });

  it('should have 8 pins when configured with 8-bit', () => {
    const model = new OutputModel({
      DATA_BITS: 8,
      OUTPUT_FORMAT: 'BITS',
    });

    const { getByTestId } = render(<OutputWidget model={model} />);

    const pinContainer = getByTestId('pin-container');
    expect(pinContainer.children).toHaveLength(8);
  });

  it('should have 16 pins when configured with 16-bit', () => {
    const model = new OutputModel({
      DATA_BITS: 16,
      OUTPUT_FORMAT: 'BITS',
    });

    const { getByTestId } = render(<OutputWidget model={model} />);

    const pinContainer = getByTestId('pin-container');
    expect(pinContainer.children).toHaveLength(16);
  });

  it('should display pin values accordingly', () => {
    const model = new OutputModel({
      DATA_BITS: 16,
      OUTPUT_FORMAT: 'BITS',
    });
    const spy = jest.spyOn(model, 'getInput');
    spy.mockImplementation(() => [
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
      1,
      0,
    ]);

    const { getByTestId } = render(<OutputWidget model={model} />);
    const pinContainer = getByTestId('pin-container');

    Array.from(pinContainer.children).forEach((pin, i) => {
      expect(pin).toContainHTML(i % 2 ? '0' : '1');
    });
  });

  it('should display decimal values accordingly', () => {
    const model = new OutputModel({
      DATA_BITS: 16,
      OUTPUT_FORMAT: 'DECIMAL',
    });
    const spy = jest.spyOn(model, 'getInput');
    spy.mockImplementation(() => 0b1010_1010_1010_1010);

    const { getByTestId } = render(<OutputWidget model={model} />);
    const pinContainer = getByTestId('pin-container');

    expect(pinContainer).toContainHTML('43690');
  });

  it('should display hexadecimal values accordingly', () => {
    const model = new OutputModel({
      DATA_BITS: 16,
      OUTPUT_FORMAT: 'HEXADECIMAL',
    });
    const spy = jest.spyOn(model, 'getInput');
    spy.mockImplementation(() => 0b1010_1010_1010_1010);

    const { getByTestId } = render(<OutputWidget model={model} />);
    const pinContainer = getByTestId('pin-container');

    expect(pinContainer).toContainHTML('0xaaaa');
  });

  it('should display errored values accordingly', () => {
    const model = new OutputModel({
      DATA_BITS: 16,
      OUTPUT_FORMAT: 'DECIMAL',
    });
    const spy = jest.spyOn(model, 'getInput');
    spy.mockImplementation(() => Array(16).fill('e'));

    const { getByTestId } = render(<OutputWidget model={model} />);
    const pinContainer = getByTestId('pin-container');

    expect(pinContainer).toContainHTML('(error)');
  });
});
