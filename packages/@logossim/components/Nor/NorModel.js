import { BaseModel } from '@logossim/core';

export default class NorModel extends BaseModel {
  initialize(configurations) {
    this.bits = parseInt(configurations.DATA_BITS, 10);

    const INPUT_PORTS_NUMBER = parseInt(
      configurations.INPUT_PORTS_NUMBER,
      10,
    );

    for (let i = 0; i < INPUT_PORTS_NUMBER; i += 1) {
      this.addInputPort(`in${i}`, this.bits);
    }
    this.addOutputPort('out', this.bits);
  }

  step(input) {
    const MAX_VALUE = 0b1111_1111_1111_1111_1111_1111_1111_1111;
    const mask = MAX_VALUE >>> (32 - this.bits);

    const or = Object.values(input).reduce((acc, curr) => acc | curr);

    return {
      out: ~or & mask,
    };
  }
}
