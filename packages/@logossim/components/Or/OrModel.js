import { BaseModel } from '@logossim/core';

export default class OrModel extends BaseModel {
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

  step(input) {
    return {
      out: Object.values(input).some(value => !!value) ? 1 : 0,
    };
  }
}
