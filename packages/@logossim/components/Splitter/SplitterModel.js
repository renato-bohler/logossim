import { BaseModel } from '@logossim/core';

export default class SplitterModel extends BaseModel {
  initialize(configurations) {
    this.bits = Number(configurations.DATA_BITS);

    this.addInputPort('in', this.bits);
    for (let i = 0; i < this.bits; i += 1) {
      this.addOutputPort(`out${i}`);
    }
  }

  getBitAt(input, index) {
    const mask = 0b1 << index;
    const result = input & mask;

    return result > 0 ? 1 : 0;
  }

  step(input) {
    return Object.fromEntries(
      [...new Array(this.bits)].map((_, index) => [
        `out${index}`,
        this.getBitAt(input.in, index),
      ]),
    );
  }

  stepFloating(input) {
    return Object.fromEntries(
      [...new Array(this.bits)].map((_, index) => [
        `out${this.bits - index - 1}`,
        [input.in[index]],
      ]),
    );
  }

  stepError(input) {
    return this.stepFloating(input);
  }
}
