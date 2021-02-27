/* eslint-disable no-new */
import { convertNumberValueToArray } from '@logossim/core/Simulation/utils';

import MuxModel from '../MuxModel';

const { addPort } = global;

const addInputSpy = jest.spyOn(MuxModel.prototype, 'addInputPort');
addInputSpy.mockImplementation(addPort);

const addOutputSpy = jest.spyOn(MuxModel.prototype, 'addOutputPort');
addOutputSpy.mockImplementation(addPort);

it('should add ports on initialization (2 inputs)', () => {
  new MuxModel({
    DATA_BITS: 1,
    INPUT_NUMBER: 2,
  });

  expect(addOutputSpy).toHaveBeenCalledWith('out', 1);
  expect(addInputSpy).toHaveBeenCalledWith('selection', 1);
  [...Array(2).keys()].forEach(i => {
    expect(addInputSpy).toHaveBeenCalledWith(`in${i}`, 1);
  });
});

it('should add ports on initialization (4 inputs)', () => {
  new MuxModel({
    DATA_BITS: 8,
    INPUT_NUMBER: 4,
  });

  expect(addOutputSpy).toHaveBeenCalledWith('out', 8);
  expect(addInputSpy).toHaveBeenCalledWith('selection', 2);
  [...Array(4).keys()].forEach(i => {
    expect(addInputSpy).toHaveBeenCalledWith(`in${i}`, 8);
  });
});

it('should add ports on initialization (16 inputs)', () => {
  new MuxModel({
    DATA_BITS: 4,
    INPUT_NUMBER: 16,
  });

  expect(addOutputSpy).toHaveBeenCalledWith('out', 4);
  expect(addInputSpy).toHaveBeenCalledWith('selection', 4);
  [...Array(16).keys()].forEach(i => {
    expect(addInputSpy).toHaveBeenCalledWith(`in${i}`, 4);
  });
});

it('should correctly select the input based on selection value', () => {
  const DATA_BITS = 4;

  const model = new MuxModel({
    DATA_BITS,
    INPUT_NUMBER: 16,
  });

  [...Array(16).keys()].forEach(i => {
    expect(
      model.stepAndMask({
        selection: i,
        in0: 0b0000,
        in1: 0b0001,
        in2: 0b0010,
        in3: 0b0011,
        in4: 0b0100,
        in5: 0b0101,
        in6: 0b0110,
        in7: 0b0111,
        in8: 0b1000,
        in9: 0b1001,
        in10: 0b1010,
        in11: 0b1011,
        in12: 0b1100,
        in13: 0b1101,
        in14: 0b1110,
        in15: 0b1111,
      }),
    ).toEqual({
      out: convertNumberValueToArray(i, DATA_BITS),
    });
  });
});
