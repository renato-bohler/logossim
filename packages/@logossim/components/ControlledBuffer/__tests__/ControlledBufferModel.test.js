import ControlledBufferModel from '../ControlledBufferModel';

const { addPort } = global;

describe('ControlledBufferModel', () => {
  it('should add ports on initialization', () => {
    const addInputSpy = jest.spyOn(
      ControlledBufferModel.prototype,
      'addInputPort',
    );
    addInputSpy.mockImplementation(addPort);

    const addOutputSpy = jest.spyOn(
      ControlledBufferModel.prototype,
      'addOutputPort',
    );
    addOutputSpy.mockImplementation(addPort);

    new ControlledBufferModel({
      DATA_BITS: 4,
    });

    expect(addInputSpy).toHaveBeenCalledWith('control');
    expect(addInputSpy).toHaveBeenCalledWith('in', { bits: 4 });
    expect(addOutputSpy).toHaveBeenCalledWith('out', { bits: 4 });
  });

  it('should output floating values when control is not set', () => {
    const model = new ControlledBufferModel({
      DATA_BITS: 4,
    });

    expect(
      model.stepFloating({
        control: [0],
        in: [0, 1, 'x', 'e'],
      }),
    ).toEqual({ out: 'x' });
  });

  it('should output values unmodified when control is set', () => {
    const model = new ControlledBufferModel({
      DATA_BITS: 4,
    });

    expect(
      model.stepFloating({
        control: [1],
        in: [0, 1, 'x', 'e'],
      }),
    ).toEqual({ out: [0, 1, 'x', 'e'] });
  });

  it('should output error when control is floating', () => {
    const model = new ControlledBufferModel({
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
