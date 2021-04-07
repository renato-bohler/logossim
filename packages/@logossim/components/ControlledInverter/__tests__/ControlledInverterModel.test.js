import ControlledInverterModel from '../ControlledInverterModel';

const { addPort } = global;

describe('ControlledInverterModel', () => {
  it('should add ports on initialization', () => {
    const addInputSpy = jest.spyOn(
      ControlledInverterModel.prototype,
      'addInputPort',
    );
    addInputSpy.mockImplementation(addPort);

    const addOutputSpy = jest.spyOn(
      ControlledInverterModel.prototype,
      'addOutputPort',
    );
    addOutputSpy.mockImplementation(addPort);

    new ControlledInverterModel({
      DATA_BITS: 4,
    });

    expect(addInputSpy).toHaveBeenCalledWith('control');
    expect(addInputSpy).toHaveBeenCalledWith('in', { bits: 4 });
    expect(addOutputSpy).toHaveBeenCalledWith('out', { bits: 4 });
  });

  it('should output floating values when control is not set', () => {
    const model = new ControlledInverterModel({
      DATA_BITS: 4,
    });

    expect(
      model.stepFloating({
        control: [0],
        in: [0, 1, 'x', 'e'],
      }),
    ).toEqual({ out: 'x' });
  });

  it('should output values negated values when control is set', () => {
    const model = new ControlledInverterModel({
      DATA_BITS: 4,
    });

    expect(
      model.stepFloating({
        control: [1],
        in: [0, 1, 'x', 'e'],
      }),
    ).toEqual({ out: [1, 0, 'e', 'e'] });
  });

  it('should output error when control is floating', () => {
    const model = new ControlledInverterModel({
      DATA_BITS: 4,
    });

    expect(
      model.stepFloating({
        control: ['x'],
        in: [0, 1, 'x', 'e'],
      }),
    ).toEqual({ out: 'e' });
  });
});
