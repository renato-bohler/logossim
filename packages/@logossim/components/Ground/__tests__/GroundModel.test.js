import GroundModel from '../GroundModel';

const { addPort } = global;

describe('GroundModel', () => {
  it('should add output port on initialization', () => {
    const addOutputSpy = jest.spyOn(
      GroundModel.prototype,
      'addOutputPort',
    );
    addOutputSpy.mockImplementation(addPort);

    new GroundModel({
      DATA_BITS: 16,
    });

    expect(addOutputSpy).toHaveBeenCalledWith('out', { bits: 16 });
  });

  it('should always return low values', () => {
    const model = new GroundModel({
      DATA_BITS: 16,
    });
    const spy = jest.spyOn(model, 'emit');

    model.onSimulationStart();

    expect(spy).toHaveBeenCalledWith({ out: 0 });
  });
});
