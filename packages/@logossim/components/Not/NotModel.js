import { BaseModel } from '@logossim/core';

export default class BufferModel extends BaseModel {
  initialize(configurations) {
    const DATA_BITS = parseInt(configurations.DATA_BITS, 10);

    this.addInputPort('in', DATA_BITS);
    this.addOutputPort('out', DATA_BITS);
  }

  step(input) {
    return {
      out: ~input.in,
    };
  }
}
