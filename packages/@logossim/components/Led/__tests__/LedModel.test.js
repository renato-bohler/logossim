/* eslint-disable no-new */
import LedModel from '../LedModel';

it('should add ports on initialization', () => {
  const spy = jest.spyOn(LedModel.prototype, 'addInputPort');
  spy.mockImplementation(() => {});

  new LedModel();

  expect(spy).toHaveBeenCalledWith('in');
});
