import SplitterModel from '../SplitterModel';

const { addPort } = global;

describe('SplitterModel', () => {
  it('should add ports on initialization', () => {
    const addInputSpy = jest.spyOn(
      SplitterModel.prototype,
      'addInputPort',
    );
    addInputSpy.mockImplementation(addPort);

    const addOutputSpy = jest.spyOn(
      SplitterModel.prototype,
      'addOutputPort',
    );
    addOutputSpy.mockImplementation(addPort);

    new SplitterModel({
      DATA_BITS: 16,
    });

    expect(addInputSpy).toHaveBeenCalledWith('in', { bits: 16 });
    [...Array(16).keys()].forEach(i => {
      expect(addOutputSpy).toHaveBeenNthCalledWith(i + 1, `out${i}`);
    });
  });

  it('should correctly split the input value', () => {
    const model = new SplitterModel({
      DATA_BITS: 16,
    });

    expect(
      model.step({
        in: 0b1010_0101_1111_0000,
      }),
    ).toEqual({
      out0: 0,
      out1: 0,
      out2: 0,
      out3: 0,
      out4: 1,
      out5: 1,
      out6: 1,
      out7: 1,
      out8: 1,
      out9: 0,
      out10: 1,
      out11: 0,
      out12: 0,
      out13: 1,
      out14: 0,
      out15: 1,
    });
  });

  it('should correctly split having floating values', () => {
    const model = new SplitterModel({
      DATA_BITS: 2,
    });

    expect(
      model.stepFloating({
        in: [0, 'x'],
      }),
    ).toEqual({
      out0: 'x',
      out1: 0,
    });
  });

  it('should correctly split having error values', () => {
    const model = new SplitterModel({
      DATA_BITS: 2,
    });

    expect(
      model.stepFloating({
        in: [0, 'e'],
      }),
    ).toEqual({
      out0: 'e',
      out1: 0,
    });
  });
});
