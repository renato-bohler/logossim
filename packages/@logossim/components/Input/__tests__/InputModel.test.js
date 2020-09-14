/* eslint-disable no-new */
import InputModel from '../InputModel';

const { addPort } = global;

it('should add ports on initialization', () => {
  const spy = jest.spyOn(InputModel.prototype, 'addOutputPort');
  spy.mockImplementation(addPort);

  new InputModel({ DATA_BITS: 1 });

  expect(spy).toHaveBeenCalledWith('out', 1);
});

it('should emit on simulation start', () => {
  const model = new InputModel({ DATA_BITS: 1 });
  const spy = jest.spyOn(model, 'emit');
  model.onSimulationStart();

  expect(spy).toHaveBeenCalledWith({ out: 0 });
});

it('should emit toggling value on click', () => {
  const model = new InputModel({ DATA_BITS: 2 });
  const emitSpy = jest.spyOn(model, 'emit');
  const outputSpy = jest.spyOn(model, 'getOutput');
  outputSpy.mockImplementation(() => 0b01);

  model.onClick(0);
  model.onClick(1);

  expect(emitSpy).toHaveBeenNthCalledWith(1, { out: 0b00 });
  expect(emitSpy).toHaveBeenNthCalledWith(2, { out: 0b11 });
});
