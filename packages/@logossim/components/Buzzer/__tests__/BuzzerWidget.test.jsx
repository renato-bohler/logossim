import React from 'react';

import { render } from '../../testUtils';
import BuzzerModel from '../BuzzerModel';
import BuzzerWidget from '../BuzzerWidget';

describe('BuzzerWidget', () => {
  it('should have 1 input port', () => {
    const model = new BuzzerModel();

    const { container } = render(<BuzzerWidget model={model} />);

    const ports = container.querySelectorAll('[data-name=in]');
    expect(ports).toHaveLength(1);
  });

  it('should display a shadow when active', () => {
    const model = new BuzzerModel();
    const spy = jest.spyOn(model, 'isActive');
    spy.mockImplementation(() => true);

    const { getByTestId } = render(<BuzzerWidget model={model} />);
    const body = getByTestId('body');

    expect(body).toHaveStyle('box-shadow: 0 0 15px black');
  });

  it('should not display a shadow when inactive', () => {
    const model = new BuzzerModel();
    const spy = jest.spyOn(model, 'isActive');
    spy.mockImplementation(() => false);

    const { getByTestId } = render(<BuzzerWidget model={model} />);
    const body = getByTestId('body');

    expect(body).toHaveStyle('box-shadow: 0 0 0px black');
  });
});
