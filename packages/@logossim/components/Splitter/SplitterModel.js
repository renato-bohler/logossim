import { BaseModel } from '@logossim/core';

export default class SplitterModel extends BaseModel {
  initialize(configurations) {
    this.bits = Number(configurations.DATA_BITS);

    this.addInputPort('in', { bits: this.bits });
    for (let i = 0; i < this.bits; i += 1) {
      this.addOutputPort(`out${i}`);
    }
  }

  step(input) {
    return Object.fromEntries(
      input.in
        .asArray(this.bits)
        .map((bit, index, { length }) => [
          `out${length - index - 1}`,
          bit,
        ]),
    );
  }

  stepFloating(input) {
    return this.step(input);
  }

  stepError(input) {
    return this.step(input);
  }
}
