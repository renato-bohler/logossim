/* eslint-disable no-new */
import LedModel from '../LedModel';

const { addPort } = global;

it('should add ports on initialization', () => {
  const spy = jest.spyOn(LedModel.prototype, 'addInputPort');
  spy.mockImplementation(addPort);

  new LedModel();

  expect(spy).toHaveBeenCalledWith('in');
});
