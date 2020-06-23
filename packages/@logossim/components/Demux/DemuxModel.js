import { BaseModel } from '@logossim/core';

export default class DemuxModel extends BaseModel {
  initialize(configurations) {
    const DATA_BITS = Number(configurations.DATA_BITS);
    this.outputNumber = Number(configurations.OUTPUT_NUMBER);

    this.addInputPort('in', DATA_BITS);
    this.addInputPort('selection', Math.log2(this.outputNumber));

    for (let i = 0; i < this.outputNumber; i += 1) {
      this.addOutputPort(`out${i}`, DATA_BITS);
    }
  }

  step(input) {
    return {
      ...Object.fromEntries(
        [...new Array(this.outputNumber)].map((_, i) => [
          `out${i}`,
          0,
        ]),
      ),
      [`out${input.selection}`]: input.in,
    };
  }
}
