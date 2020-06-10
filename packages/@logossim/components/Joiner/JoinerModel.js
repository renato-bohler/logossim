import { BaseModel } from '@logossim/core';

export default class JoinerModel extends BaseModel {
  initialize(configurations) {
    this.bits = parseInt(configurations.DATA_BITS, 10);

    for (let i = 0; i < this.bits; i += 1) {
      this.addInputPort(`in${i}`);
    }
    this.addOutputPort('out', this.bits);
  }

  step(input) {
    return {
      out: [...new Array(this.bits)]
        .map((_, index) => input[`in${index}`])
        .reduce((acc, curr, index) => acc + curr * 2 ** index, 0),
    };
  }
}
