import { BaseModel } from '@logossim/core';

export default class XorModel extends BaseModel {
  initialize(configurations) {
    this.behavior = configurations.MULTIPLE_INPUT_BEHAVIOR;

    const INPUT_PORTS_NUMBER = parseInt(
      configurations.INPUT_PORTS_NUMBER,
      10,
    );
    const DATA_BITS = parseInt(configurations.DATA_BITS, 10);

    for (let i = 0; i < INPUT_PORTS_NUMBER; i += 1) {
      this.addInputPort(`in${i}`, DATA_BITS);
    }
    this.addOutputPort('out', DATA_BITS);
  }

  // TODO: adjust step logic to consider DATA_BITS
  step(input) {
    const numberOfOnInputs = Object.values(input).filter(
      value => value === 1,
    ).length;

    switch (this.behavior) {
      case 'ONE':
        return { out: numberOfOnInputs === 1 ? 1 : 0 };
      case 'ODD':
        return { out: numberOfOnInputs % 2 === 1 ? 1 : 0 };
      default:
        return {};
    }
  }
}
