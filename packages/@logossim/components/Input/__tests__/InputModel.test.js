import InputModel from '../InputModel';

const { addPort } = global;

describe('InputModel', () => {
  it('should add ports on initialization', () => {
    const spy = jest.spyOn(InputModel.prototype, 'addOutputPort');
    spy.mockImplementation(addPort);

    new InputModel({ DATA_BITS: 1 });

    expect(spy).toHaveBeenCalledWith('out', { bits: 1 });
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
    outputSpy.mockImplementation(() => [0, 1]);

    model.onClick(0);
    model.onClick(1);

    expect(emitSpy).toHaveBeenNthCalledWith(1, { out: [1, 1] });
    expect(emitSpy).toHaveBeenNthCalledWith(2, { out: [0, 0] });
  });

  it('should emit correctly for three state value on click', () => {
    const model = new InputModel({
      DATA_BITS: 4,
      THREE_STATE: 'true',
    });
    const emitSpy = jest.spyOn(model, 'emit');
    const outputSpy = jest.spyOn(model, 'getOutput');
    outputSpy.mockImplementation(() => [0, 1, 'x', 0]);

    model.onClick(0);
    model.onClick(1);
    model.onClick(2);

    expect(emitSpy).toHaveBeenNthCalledWith(1, {
      out: [1, 1, 'x', 0],
    });
    expect(emitSpy).toHaveBeenNthCalledWith(2, {
      out: [0, 'x', 'x', 0],
    });
    expect(emitSpy).toHaveBeenNthCalledWith(3, { out: [0, 1, 0, 0] });
  });
});
