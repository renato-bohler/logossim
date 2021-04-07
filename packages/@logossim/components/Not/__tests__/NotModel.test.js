import NotModel from '../NotModel';

const { addPort } = global;

describe('NotModel', () => {
  it('should add ports on initialization', () => {
    const addInputSpy = jest.spyOn(
      NotModel.prototype,
      'addInputPort',
    );
    addInputSpy.mockImplementation(addPort);

    const addOutputSpy = jest.spyOn(
      NotModel.prototype,
      'addOutputPort',
    );
    addOutputSpy.mockImplementation(addPort);

    new NotModel({
      DATA_BITS: 4,
    });

    expect(addInputSpy).toHaveBeenCalledWith('in', { bits: 4 });
    expect(addOutputSpy).toHaveBeenCalledWith('out', { bits: 4 });
  });

  it('should return the value negated', () => {
    const model = new NotModel({
      DATA_BITS: 1,
    });

    expect(
      model.step({
        in: 0,
      }),
    ).toEqual({ out: [1] });

    expect(
      model.step({
        in: 1,
      }),
    ).toEqual({ out: [0] });
  });

  it('should return the value negated for multiple bits', () => {
    const DATA_BITS = 8;

    const model = new NotModel({
      DATA_BITS,
    });

    expect(
      model.step({
        in: 0b0101_1010,
      }),
    ).toEqual({
      out: (0b1010_0101).asArray(DATA_BITS),
    });
  });
});
