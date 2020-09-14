import React from 'react';

import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';

import ButtonModel from '../ButtonModel';
import ButtonWidget from '../ButtonWidget';

const { engine } = global;

it('should have 1 output port', () => {
  const model = new ButtonModel();

  const { container } = render(
    <ButtonWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name=out]');
  expect(ports).toHaveLength(1);
});

it('should call model onClick on mouse down event', () => {
  const model = new ButtonModel();
  const spy = jest.spyOn(model, 'onClick');

  const { getByRole } = render(
    <ButtonWidget model={model} engine={engine} />,
  );
  const button = getByRole('button');

  fireEvent.mouseDown(button);

  expect(spy).toHaveBeenCalledTimes(1);
});

it('should call model onRelease on mouse up event', () => {
  const model = new ButtonModel();
  const spy = jest.spyOn(model, 'onRelease');

  render(<ButtonWidget model={model} engine={engine} />);

  fireEvent.mouseUp(document.body);

  expect(spy).toHaveBeenCalledTimes(1);
});
