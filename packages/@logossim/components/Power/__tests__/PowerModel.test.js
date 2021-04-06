import PowerModel from '../PowerModel';

const { addPort } = global;

describe('PowerModel', () => {
  it('should add output port on initialization', () => {
    const addOutputSpy = jest.spyOn(
      PowerModel.prototype,
      'addOutputPort',
    );
    addOutputSpy.mockImplementation(addPort);

    new PowerModel({
      DATA_BITS: 16,
    });

    expect(addOutputSpy).toHaveBeenCalledWith('out', { bits: 16 });
  });

  it('should always return high values', () => {
    const model = new PowerModel({
      DATA_BITS: 16,
    });
    const spy = jest.spyOn(model, 'emit');

    model.onSimulationStart();

    expect(spy).toHaveBeenCalledWith({ out: 0b1111_1111_1111_1111 });
  });
});
