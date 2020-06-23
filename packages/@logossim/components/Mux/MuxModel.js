import { BaseModel } from '@logossim/core';

export default class MuxModel extends BaseModel {
  initialize(configurations) {
    const DATA_BITS = parseInt(configurations.DATA_BITS, 10);
    const INPUT_NUMBER = parseInt(configurations.INPUT_NUMBER, 10);

    for (let i = 0; i < INPUT_NUMBER; i += 1) {
      this.addInputPort(`in${i}`, DATA_BITS);
    }

    this.addInputPort('selection', Math.log2(INPUT_NUMBER));
    this.addOutputPort('out', DATA_BITS);
  }

  step(input) {
    return { out: input[`in${input.selection}`] };
  }
}
