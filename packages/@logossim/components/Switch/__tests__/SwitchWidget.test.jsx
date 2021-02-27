import React from 'react';

import { render } from '@testing-library/react';

import SwitchModel from '../SwitchModel';
import SwitchWidget from '../SwitchWidget';

const { engine } = global;

it('should have 1 output port', () => {
  const model = new SwitchModel();

  const { container } = render(
    <SwitchWidget model={model} engine={engine} />,
  );

  const ports = container.querySelectorAll('[data-name=out]');
  expect(ports).toHaveLength(1);
});

it('should call model onClick on mouse down event', () => {
  const model = new SwitchModel();
  const spy = jest.spyOn(model, 'onClick');

  const { getByRole } = render(
    <SwitchWidget model={model} engine={engine} />,
  );
  const button = getByRole('button');

  button.click();

  expect(spy).toHaveBeenCalledTimes(1);
});

it('should translate value indicator to left when value is 0', () => {
  const model = new SwitchModel();
  const spy = jest.spyOn(model, 'getOutput');
  spy.mockImplementation(() => [0]);

  const { getByRole } = render(
    <SwitchWidget model={model} engine={engine} />,
  );
  const button = getByRole('button');
  const value = button.children[0];

  expect(value).toHaveStyle('transform: translateX(-6px)');
});

it('should translate value indicator to right when value is 1', () => {
  const model = new SwitchModel();
  const spy = jest.spyOn(model, 'getOutput');
  spy.mockImplementation(() => [1]);

  const { getByRole } = render(
    <SwitchWidget model={model} engine={engine} />,
  );
  const button = getByRole('button');
  const value = button.children[0];

  expect(value).toHaveStyle('transform: translateX(6px)');
});
