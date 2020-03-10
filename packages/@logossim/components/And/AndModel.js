import { BaseModel } from '@logossim/core';

export default class AndModel extends BaseModel {
  initialize(configurations) {
    const INPUT_PORTS_NUMBER = parseInt(
      configurations.INPUT_PORTS_NUMBER,
      10,
    );

    for (let i = 0; i < INPUT_PORTS_NUMBER; i += 1) {
      this.addPort(`in${i}`);
    }
    this.addPort('out');
  }

  step(inputs) {
    if (inputs.in0 === 1) return { in0: 0, in1: 1, out: 2 };
    if (inputs.in0 === 0) return { in0: 2, in1: 0, out: 1 };
    if (inputs.in0 === 2) return { in0: 1, in1: 2, out: 0 };
    return {};
  }
}
