/* eslint-disable no-new */
import OutputModel from '../OutputModel';

const { addPort } = global;

it('should add ports on initialization', () => {
  const spy = jest.spyOn(OutputModel.prototype, 'addInputPort');
  spy.mockImplementation(addPort);

  new OutputModel({ DATA_BITS: 1 });

  expect(spy).toHaveBeenCalledWith('in', { bits: 1 });
});
