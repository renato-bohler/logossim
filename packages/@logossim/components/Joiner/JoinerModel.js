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
      out: Object.values(input)
        .map(value => value.asArray(1)[0])
        .map((_, index, arr) => arr[arr.length - index - 1]),
    };
  }

  stepFloating(input) {
    return this.step(input);
  }

  stepError(input) {
    return this.step(input);
  }
}
