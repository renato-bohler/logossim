import { BaseModel } from '@logossim/core';

export default class NandModel extends BaseModel {
  initialize(configurations) {
    const INPUT_PORTS_NUMBER = Number(
      configurations.INPUT_PORTS_NUMBER,
    );
    const DATA_BITS = Number(configurations.DATA_BITS);

    for (let i = 0; i < INPUT_PORTS_NUMBER; i += 1) {
      this.addInputPort(`in${i}`, DATA_BITS);
    }
    this.addOutputPort('out', DATA_BITS);
  }

  step(input) {
    return {
      out: ~Object.values(input).reduce((acc, curr) => acc & curr),
    };
  }
}
