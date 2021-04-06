import React from 'react';

import { render } from '../../testUtils';
import SsdModel from '../SsdModel';
import SsdWidget from '../SsdWidget';

describe('SsdWidget', () => {
  it('should have all input ports', () => {
    const model = new SsdModel();

    const { container } = render(<SsdWidget model={model} />);

    const portA = container.querySelector('[data-name=a]');
    const portB = container.querySelector('[data-name=b]');
    const portC = container.querySelector('[data-name=c]');
    const portD = container.querySelector('[data-name=d]');
    const portE = container.querySelector('[data-name=e]');
    const portF = container.querySelector('[data-name=f]');
    const portG = container.querySelector('[data-name=g]');
    const portDP = container.querySelector('[data-name=dp]');

    expect(portA).toBeTruthy();
    expect(portB).toBeTruthy();
    expect(portC).toBeTruthy();
    expect(portD).toBeTruthy();
    expect(portE).toBeTruthy();
    expect(portF).toBeTruthy();
    expect(portG).toBeTruthy();
    expect(portDP).toBeTruthy();
  });

  it('should turn on the correct display segments when configured with active on high', () => {
    const model = new SsdModel({
      ACTIVE_WHEN: 'LOW',
      ON_COLOR: '#ff0000',
      OFF_COLOR: '#000000',
    });
    const spy = jest.spyOn(model, 'getInput');
    spy.mockImplementation(segment => {
      if (segment === 'a') return [1];
      if (segment === 'c') return [1];
      if (segment === 'e') return [1];
      if (segment === 'g') return [1];
      return [0];
    });

    const { getByTestId } = render(<SsdWidget model={model} />);

    const a = getByTestId('a');
    const b = getByTestId('b');
    const c = getByTestId('c');
    const d = getByTestId('d');
    const e = getByTestId('e');
    const f = getByTestId('f');
    const g = getByTestId('g');
    const dp = getByTestId('dp');

    expect(a).toHaveAttribute('fill', '#000000');
    expect(b).toHaveAttribute('fill', '#ff0000');
    expect(c).toHaveAttribute('fill', '#000000');
    expect(d).toHaveAttribute('fill', '#ff0000');
    expect(e).toHaveAttribute('fill', '#000000');
    expect(f).toHaveAttribute('fill', '#ff0000');
    expect(g).toHaveAttribute('fill', '#000000');
    expect(dp).toHaveAttribute('fill', '#ff0000');
  });

  it('should turn on the correct display segments when configured with active on high', () => {
    const model = new SsdModel({
      ACTIVE_WHEN: 'HIGH',
      ON_COLOR: '#ff0000',
      OFF_COLOR: '#000000',
    });
    const spy = jest.spyOn(model, 'getInput');
    spy.mockImplementation(segment => {
      if (segment === 'a') return [1];
      if (segment === 'c') return [1];
      if (segment === 'e') return [1];
      if (segment === 'g') return [1];
      return [0];
    });

    const { getByTestId } = render(<SsdWidget model={model} />);

    const a = getByTestId('a');
    const b = getByTestId('b');
    const c = getByTestId('c');
    const d = getByTestId('d');
    const e = getByTestId('e');
    const f = getByTestId('f');
    const g = getByTestId('g');
    const dp = getByTestId('dp');

    expect(a).toHaveAttribute('fill', '#ff0000');
    expect(b).toHaveAttribute('fill', '#000000');
    expect(c).toHaveAttribute('fill', '#ff0000');
    expect(d).toHaveAttribute('fill', '#000000');
    expect(e).toHaveAttribute('fill', '#ff0000');
    expect(f).toHaveAttribute('fill', '#000000');
    expect(g).toHaveAttribute('fill', '#ff0000');
    expect(dp).toHaveAttribute('fill', '#000000');
  });
});
