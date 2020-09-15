/* eslint-disable no-new */
import SsdModel from '../SsdModel';

const { addPort } = global;

it('should add ports on initialization', () => {
  const spy = jest.spyOn(SsdModel.prototype, 'addInputPort');
  spy.mockImplementation(addPort);

  new SsdModel();

  expect(spy).toHaveBeenCalledWith('a');
  expect(spy).toHaveBeenCalledWith('b');
  expect(spy).toHaveBeenCalledWith('c');
  expect(spy).toHaveBeenCalledWith('d');
  expect(spy).toHaveBeenCalledWith('e');
  expect(spy).toHaveBeenCalledWith('f');
  expect(spy).toHaveBeenCalledWith('g');
  expect(spy).toHaveBeenCalledWith('dp');
});
