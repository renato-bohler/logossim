import { BaseModel } from '@logossim/core';

export default class AndModel extends BaseModel {
  mod = 0;

  initialize(configurations) {
    const INPUT_PORTS_NUMBER = parseInt(
      configurations.INPUT_PORTS_NUMBER,
      10,
    );

    for (let i = 0; i < INPUT_PORTS_NUMBER; i += 1) {
      this.addInputPort(`in${i}`);
    }
    this.addOutputPort('out');
  }

  step() {
    this.mod = (this.mod + 1) % 2;

    if (this.mod === 0) return { out: 0 };
    if (this.mod === 1) return { out: 1 };
    return {};
  }
}
