import { BaseModel } from '@logossim/core';

export default class BufferModel extends BaseModel {
  initialize(configurations) {
    this.bits = parseInt(configurations.DATA_BITS, 10);

    this.addInputPort('in', this.bits);
    this.addOutputPort('out', this.bits);
  }

  step(input) {
    const MAX_VALUE = 0b1111_1111_1111_1111_1111_1111_1111_1111;
    const mask = MAX_VALUE >>> (32 - this.bits);

    return {
      out: ~input.in & mask,
    };
  }
}
