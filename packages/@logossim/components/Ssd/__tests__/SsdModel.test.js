import SsdModel from '../SsdModel';

const { addPort } = global;

describe('SsdModel', () => {
  it('should add ports on initialization', () => {
    const spy = jest.spyOn(SsdModel.prototype, 'addInputPort');
    spy.mockImplementation(addPort);

    new SsdModel();

    expect(spy).toHaveBeenCalledWith('a', { error: 0, floating: 0 });
    expect(spy).toHaveBeenCalledWith('b', { error: 0, floating: 0 });
    expect(spy).toHaveBeenCalledWith('c', { error: 0, floating: 0 });
    expect(spy).toHaveBeenCalledWith('d', { error: 0, floating: 0 });
    expect(spy).toHaveBeenCalledWith('e', { error: 0, floating: 0 });
    expect(spy).toHaveBeenCalledWith('f', { error: 0, floating: 0 });
    expect(spy).toHaveBeenCalledWith('g', { error: 0, floating: 0 });
    expect(spy).toHaveBeenCalledWith('dp', { error: 0, floating: 0 });
  });
});
