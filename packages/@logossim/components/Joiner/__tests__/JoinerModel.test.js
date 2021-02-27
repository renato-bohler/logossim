/* eslint-disable no-new */
import { convertNumberValueToArray } from '@logossim/core/Simulation/utils';

import JoinerModel from '../JoinerModel';

const { addPort } = global;

it('should add ports on initialization', () => {
  const addInputSpy = jest.spyOn(
    JoinerModel.prototype,
    'addInputPort',
  );
  addInputSpy.mockImplementation(addPort);

  const addOutputSpy = jest.spyOn(
    JoinerModel.prototype,
    'addOutputPort',
  );
  addOutputSpy.mockImplementation(addPort);

  new JoinerModel({
    DATA_BITS: 16,
  });

  expect(addOutputSpy).toHaveBeenCalledWith('out', 16);
  [...Array(16).keys()].forEach(i => {
    expect(addInputSpy).toHaveBeenNthCalledWith(i + 1, `in${i}`);
  });
});

it('should correctly join the input value', () => {
  const DATA_BITS = 16;

  const model = new JoinerModel({
    DATA_BITS,
  });

  expect(
    model.stepAndMask({
      in0: 0,
      in1: 0,
      in2: 0,
      in3: 0,
      in4: 1,
      in5: 1,
      in6: 1,
      in7: 1,
      in8: 1,
      in9: 0,
      in10: 1,
      in11: 0,
      in12: 0,
      in13: 1,
      in14: 0,
      in15: 1,
    }),
  ).toEqual({
    out: convertNumberValueToArray(0b1010_0101_1111_0000, DATA_BITS),
  });
});
