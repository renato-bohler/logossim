import { BaseModel } from '@logossim/core';

export default class JoinerModel extends BaseModel {
  initialize(configurations) {
    this.bits = Number(configurations.DATA_BITS);

    for (let i = 0; i < this.bits; i += 1) {
      this.addInputPort(`in${i}`);
    }
    this.addOutputPort('out', { bits: this.bits });
  }

  step(input) {
    return {
      out: [...new Array(this.bits)]
        .map((_, index) => input[`in${index}`])
        .reduce((acc, curr, index) => acc + curr * 2 ** index, 0),
    };
  }

  stepFloating(input) {
    return {
      out: [...new Array(this.bits)]
        .map((_, index) => input[`in${this.bits - index - 1}`])
        .flat(),
    };
  }

  stepError(input) {
    return this.stepFloating(input);
  }
}
