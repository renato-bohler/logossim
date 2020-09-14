/* eslint-disable no-new */
import OutputModel from '../OutputModel';

it('should add ports on initialization', () => {
  const spy = jest.spyOn(OutputModel.prototype, 'addInputPort');
  spy.mockImplementation(() => {});

  new OutputModel({ DATA_BITS: 1 });

  expect(spy).toHaveBeenCalledWith('in', 1);
});
