import { BaseModel } from '@logossim/core';

export default class AndModel extends BaseModel {
  mod = 0;

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

  step() {
    this.mod = (this.mod + 1) % 3;

    if (this.mod === 0) return { in0: 1, in1: 0, out: 0 };
    if (this.mod === 1) return { in0: 0, in1: 1, out: 0 };
    if (this.mod === 2) return { in0: 0, in1: 0, out: 1 };
    return {};
  }
}
