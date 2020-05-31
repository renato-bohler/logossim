import { BaseModel } from '@logossim/core';

export default class XorModel extends BaseModel {
  initialize(configurations) {
    this.behavior = configurations.MULTIPLE_INPUT_BEHAVIOR;
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

  exclusiveOrAt(values, index) {
    const mask = 0b1 << index;

    const sum = values
      .map(value => ((value & mask) > 0 ? 1 : 0))
      .reduce((acc, curr) => acc + curr);

    return sum === 1 ? 1 : 0;
  }

  step(input) {
    const values = Object.values(input);

    switch (this.behavior) {
      case 'ONE':
        return {
          out: parseInt(
            [...new Array(this.bits)]
              .map((_, index) => this.exclusiveOrAt(values, index))
              .reverse()
              .join(''),
            2,
          ),
        };
      case 'ODD':
        return {
          out: values.reduce((acc, curr) => curr ^ acc),
        };
      default:
        return {};
    }
  }
}
