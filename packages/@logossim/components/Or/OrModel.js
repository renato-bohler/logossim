import { BaseModel } from '@logossim/core';

export default class OrModel extends BaseModel {
  initialize(configurations) {
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
    return {
      out: Object.values(input).some(value => value === 1) ? 1 : 0,
    };
  }
}
