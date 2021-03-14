import { BaseModel } from '@logossim/core';

export default class MuxModel extends BaseModel {
  initialize(configurations) {
    const DATA_BITS = Number(configurations.DATA_BITS);
    const INPUT_NUMBER = Number(configurations.INPUT_NUMBER);

    for (let i = 0; i < INPUT_NUMBER; i += 1) {
      this.addInputPort(`in${i}`, { bits: DATA_BITS });
    }

    this.addInputPort('selection', { bits: Math.log2(INPUT_NUMBER) });
    this.addOutputPort('out', { bits: DATA_BITS });
  }

  step(input) {
    return { out: input[`in${input.selection}`] };
  }
}
