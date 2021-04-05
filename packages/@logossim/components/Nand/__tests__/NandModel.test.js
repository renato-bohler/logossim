import NandModel from '../NandModel';

const { addPort } = global;

it('should add ports on initialization', () => {
  const addInputSpy = jest.spyOn(NandModel.prototype, 'addInputPort');
  addInputSpy.mockImplementation(addPort);

  const addOutputSpy = jest.spyOn(
    NandModel.prototype,
    'addOutputPort',
  );
  addOutputSpy.mockImplementation(addPort);

  new NandModel({
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

it("should return 1 when there's a 0 input", () => {
  const model = new NandModel({
    INPUT_PORTS_NUMBER: 4,
    DATA_BITS: 1,
  });

  expect(
    model.stepAndMask({
      in0: 0,
      in1: 0,
      in2: 0,
      in3: 0,
    }),
  ).toEqual({ out: [1] });
});

it('should return 0 when all inputs are 1', () => {
  const model = new NandModel({
    INPUT_PORTS_NUMBER: 4,
    DATA_BITS: 1,
  });

  expect(
    model.stepAndMask({
      in0: 1,
      in1: 1,
      in2: 1,
      in3: 1,
    }),
  ).toEqual({ out: [0] });
});

it('should return bitwise NAND for multiple data bits', () => {
  const DATA_BITS = 4;

  const model = new NandModel({
    INPUT_PORTS_NUMBER: 4,
    DATA_BITS,
  });

  expect(
    model.stepAndMask({
      in0: 0b0001,
      in1: 0b0011,
      in2: 0b0101,
      in3: 0b1001,
    }),
  ).toEqual({ out: (0b1110).asArray(DATA_BITS) });
});
