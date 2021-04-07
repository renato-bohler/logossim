import DemuxModel from '../DemuxModel';

const { addPort } = global;

const addInputSpy = jest.spyOn(DemuxModel.prototype, 'addInputPort');
addInputSpy.mockImplementation(addPort);

const addOutputSpy = jest.spyOn(
  DemuxModel.prototype,
  'addOutputPort',
);
addOutputSpy.mockImplementation(addPort);

describe('DemuxModel', () => {
  it('should add ports on initialization (2 outputs)', () => {
    new DemuxModel({
      DATA_BITS: 16,
      OUTPUT_NUMBER: 2,
    });

    expect(addInputSpy).toHaveBeenCalledWith('in', { bits: 16 });
    expect(addInputSpy).toHaveBeenCalledWith('selection', {
      bits: 1,
    });
    [...Array(2).keys()].forEach(i => {
      expect(addOutputSpy).toHaveBeenCalledWith(`out${i}`, {
        bits: 16,
      });
    });
  });

  it('should add ports on initialization (4 outputs)', () => {
    new DemuxModel({
      DATA_BITS: 4,
      OUTPUT_NUMBER: 4,
    });

    expect(addInputSpy).toHaveBeenCalledWith('in', { bits: 4 });
    expect(addInputSpy).toHaveBeenCalledWith('selection', {
      bits: 2,
    });
    [...Array(4).keys()].forEach(i => {
      expect(addOutputSpy).toHaveBeenCalledWith(`out${i}`, {
        bits: 4,
      });
    });
  });

  it('should add ports on initialization (16 outputs)', () => {
    new DemuxModel({
      DATA_BITS: 1,
      OUTPUT_NUMBER: 16,
    });

    expect(addInputSpy).toHaveBeenCalledWith('in', { bits: 1 });
    expect(addInputSpy).toHaveBeenCalledWith('selection', {
      bits: 4,
    });
    [...Array(16).keys()].forEach(i => {
      expect(addOutputSpy).toHaveBeenCalledWith(`out${i}`, {
        bits: 1,
      });
    });
  });

  it('should correctly forward the input based on selection value', () => {
    const model = new DemuxModel({
      DATA_BITS: 4,
      OUTPUT_NUMBER: 16,
    });

    [...Array(16).keys()].forEach(i => {
      expect(
        model.step({
          selection: i,
          in: 0b1010,
        }),
      ).toEqual({
        out0: 0,
        out1: 0,
        out2: 0,
        out3: 0,
        out4: 0,
        out5: 0,
        out6: 0,
        out7: 0,
        out8: 0,
        out9: 0,
        out10: 0,
        out11: 0,
        out12: 0,
        out13: 0,
        out14: 0,
        out15: 0,
        [`out${i}`]: 0b1010,
      });
    });
  });
});
