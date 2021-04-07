import OrModel from '../OrModel';

const { addPort } = global;

describe('OrModel', () => {
  it('should add ports on initialization', () => {
    const addInputSpy = jest.spyOn(OrModel.prototype, 'addInputPort');
    addInputSpy.mockImplementation(addPort);

    const addOutputSpy = jest.spyOn(
      OrModel.prototype,
      'addOutputPort',
    );
    addOutputSpy.mockImplementation(addPort);

    new OrModel({
      INPUT_PORTS_NUMBER: 16,
      DATA_BITS: 1,
    });

    expect(addOutputSpy).toHaveBeenCalledWith('out', { bits: 1 });
    [...Array(16).keys()].forEach(i => {
      expect(addInputSpy).toHaveBeenNthCalledWith(i + 1, `in${i}`, {
        bits: 1,
      });
    });
  });

  it("should return 1 when there's a 1 input", () => {
    const model = new OrModel({
      INPUT_PORTS_NUMBER: 4,
      DATA_BITS: 1,
    });

    expect(
      model.step({
        in0: 1,
        in1: 0,
        in2: 0,
        in3: 0,
      }),
    ).toEqual({ out: [1] });

    expect(
      model.step({
        in0: 0,
        in1: 1,
        in2: 0,
        in3: 0,
      }),
    ).toEqual({ out: [1] });

    expect(
      model.step({
        in0: 0,
        in1: 0,
        in2: 1,
        in3: 0,
      }),
    ).toEqual({ out: [1] });

    expect(
      model.step({
        in0: 0,
        in1: 0,
        in2: 0,
        in3: 1,
      }),
    ).toEqual({ out: [1] });

    expect(
      model.step({
        in0: 1,
        in1: 1,
        in2: 1,
        in3: 1,
      }),
    ).toEqual({ out: [1] });
  });

  it('should return 0 when all inputs are 0', () => {
    const model = new OrModel({
      INPUT_PORTS_NUMBER: 4,
      DATA_BITS: 1,
    });

    expect(
      model.step({
        in0: 0,
        in1: 0,
        in2: 0,
        in3: 0,
      }),
    ).toEqual({ out: [0] });
  });

  it("should return error when there's no 1 and there's one floating input", () => {
    const model = new OrModel({
      INPUT_PORTS_NUMBER: 2,
      DATA_BITS: 1,
    });

    expect(
      model.stepFloating({
        in0: [0],
        in1: ['x'],
      }),
    ).toEqual({ out: ['e'] });
  });

  it("should return error when there's no 1 and there's one error input", () => {
    const model = new OrModel({
      INPUT_PORTS_NUMBER: 2,
      DATA_BITS: 1,
    });

    expect(
      model.stepError({
        in0: [0],
        in1: ['e'],
      }),
    ).toEqual({ out: ['e'] });
  });

  it('should return bitwise OR for multiple data bits', () => {
    const DATA_BITS = 8;

    const model = new OrModel({
      INPUT_PORTS_NUMBER: 5,
      DATA_BITS,
    });

    expect(
      model.step({
        in0: 0b0000_0000,
        in1: 0b0111_1000,
        in2: 0b0110_0110,
        in3: 0b0101_0101,
      }),
    ).toEqual({
      out: (0b0111_1111).asArray(DATA_BITS),
    });
  });
});
