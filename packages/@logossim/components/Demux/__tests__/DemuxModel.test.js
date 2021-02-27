/* eslint-disable no-new */
import { convertNumberValueToArray } from '@logossim/core/Simulation/utils';

import DemuxModel from '../DemuxModel';

const { addPort } = global;

const addInputSpy = jest.spyOn(DemuxModel.prototype, 'addInputPort');
addInputSpy.mockImplementation(addPort);

const addOutputSpy = jest.spyOn(
  DemuxModel.prototype,
  'addOutputPort',
);
addOutputSpy.mockImplementation(addPort);

it('should add ports on initialization (2 outputs)', () => {
  new DemuxModel({
    DATA_BITS: 16,
    OUTPUT_NUMBER: 2,
  });

  expect(addInputSpy).toHaveBeenCalledWith('in', 16);
  expect(addInputSpy).toHaveBeenCalledWith('selection', 1);
  [...Array(2).keys()].forEach(i => {
    expect(addOutputSpy).toHaveBeenCalledWith(`out${i}`, 16);
  });
});

it('should add ports on initialization (4 outputs)', () => {
  new DemuxModel({
    DATA_BITS: 4,
    OUTPUT_NUMBER: 4,
  });

  expect(addInputSpy).toHaveBeenCalledWith('in', 4);
  expect(addInputSpy).toHaveBeenCalledWith('selection', 2);
  [...Array(4).keys()].forEach(i => {
    expect(addOutputSpy).toHaveBeenCalledWith(`out${i}`, 4);
  });
});

it('should add ports on initialization (16 outputs)', () => {
  new DemuxModel({
    DATA_BITS: 1,
    OUTPUT_NUMBER: 16,
  });

  expect(addInputSpy).toHaveBeenCalledWith('in', 1);
  expect(addInputSpy).toHaveBeenCalledWith('selection', 4);
  [...Array(16).keys()].forEach(i => {
    expect(addOutputSpy).toHaveBeenCalledWith(`out${i}`, 1);
  });
});

it('should correctly forward the input based on selection value', () => {
  const DATA_BITS = 4;

  const model = new DemuxModel({
    DATA_BITS,
    OUTPUT_NUMBER: 16,
  });

  [...Array(16).keys()].forEach(i => {
    expect(
      model.stepAndMask({
        selection: i,
        in: 0b1010,
      }),
    ).toEqual({
      out0: convertNumberValueToArray(0, DATA_BITS),
      out1: convertNumberValueToArray(0, DATA_BITS),
      out2: convertNumberValueToArray(0, DATA_BITS),
      out3: convertNumberValueToArray(0, DATA_BITS),
      out4: convertNumberValueToArray(0, DATA_BITS),
      out5: convertNumberValueToArray(0, DATA_BITS),
      out6: convertNumberValueToArray(0, DATA_BITS),
      out7: convertNumberValueToArray(0, DATA_BITS),
      out8: convertNumberValueToArray(0, DATA_BITS),
      out9: convertNumberValueToArray(0, DATA_BITS),
      out10: convertNumberValueToArray(0, DATA_BITS),
      out11: convertNumberValueToArray(0, DATA_BITS),
      out12: convertNumberValueToArray(0, DATA_BITS),
      out13: convertNumberValueToArray(0, DATA_BITS),
      out14: convertNumberValueToArray(0, DATA_BITS),
      out15: convertNumberValueToArray(0, DATA_BITS),
      [`out${i}`]: convertNumberValueToArray(0b1010, DATA_BITS),
    });
  });
});
